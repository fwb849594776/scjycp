var checked_answer = [];
var isUseOrigin = false;
var backList = 0;

function loadExam(pack, list) {
    if (document.getElementsByClassName('mdui-card').length > 0) {
        let card = document.getElementsByClassName('mdui-card')[list];
        card.innerHTML += '' +
        '<div class="mdui-progress">' +
        '    <div class="mdui-progress-indeterminate mdui-color-theme-accent"></div>' +
        '</div>';
        card.getElementsByClassName('mdui-btn')[0].classList.add('mdui-color-theme-a100');
    }
    let filename = 'exam/' + examlist[pack].type + '/' + examlist[pack].path + '/' + examlist[pack].list[list].file;
    let script = document.createElement('script');
    script.addEventListener('load', function() { script.remove(); loadData(pack); });
    script.src = filename;
    document.head.appendChild(script);
    let here = document.getElementsByClassName('mdui-toolbar')[0].getElementsByClassName('mdui-typo-title')[0];
    here.innerHTML = examlist[pack].list[list].name;
    document.getElementsByTagName('title')[0].innerHTML = examlist[pack].list[list].name + ' - 四川教育测评平台题库';
    document.getElementById('show-submit-btn').classList.remove('mdui-hidden');
    window.history.pushState('', '', '?list=' + pack + '&exam=' + list);
}

function loadData(pack) {
    for (let i = 0; i < answer_object.data.length; i ++) {
        answer_object.data[i].analyse = JSON.parse(answer_object.data[i].analyse);
        answer_object.data[i].options = JSON.parse(answer_object.data[i].options);
        answer_object.data[i].answer = JSON.parse(answer_object.data[i].answer);
        answer_object.data[i].resources = JSON.parse(answer_object.data[i].resources);
    }
    let card_container = document.getElementById('card-container');
    card_container.innerHTML = '';
    card_container.innerHTML += '<button class="mdui-btn" id="back-btn" onclick="loadExamList(' + pack + ')"><i class="mdui-icon material-icons">arrow_back</i> 返回</button>'
    card_container.innerHTML += 
    '<div class="mdui-card mdui-hoverable">' +
    '    <div class="mdui-container-fluid">' +
    '        <div id="jump-btn-group" class="mdui-col-sm-4 mdui-btn-group"></div>' +
    '        <div id="answer-box" class="mdui-col-sm-8">' +
    '            <div class="mdui-typo-title"></div>' +
    '            <div id="resource-box" class="mdui-float-right"></div>' +
    '            <form id="answer-form"></form>' +
    '            <div id="analyse-box" class="mdui-text-color-pink-accent mdui-hidden"></div>' +
    '            <button class="mdui-btn mdui-btn-dense mdui-color-theme-accent">上一题</button>' +
    '            <button class="mdui-btn mdui-btn-dense mdui-color-theme-accent">下一题</button>' +
    '            <button class="mdui-btn mdui-btn-dense mdui-color-pink-accent" mdui-dialog="{target: \'#submit-dialog\'}">提交</button>' +
    '        </div>' +
    '    </div>' +
    '</div>';
    card_container.getElementsByClassName('mdui-card')[0].innerHTML += '' +
    '<div class="mdui-progress">' +
    '    <div class="mdui-progress-determinate mdui-color-theme-accent" style="width: 0%;"></div>' +
    '</div>';
    let jump_btn_group = document.getElementById('jump-btn-group');
    jump_btn_group.innerHTML = '';
    for (let i = 0; i < answer_object.data.length; i ++) {
        jump_btn_group.innerHTML += '<button class="mdui-btn" onclick="loadProblem(' + i + ')">' + (i + 1) + '</button>';
    }
    jump_btn_group.getElementsByClassName('mdui-btn')[0].classList.add('mdui-btn-active');
    checked_answer = [];
    for (let i = 0; i < answer_object.data.length; i ++) {
        checked_answer.push([]);
    }
    let submit_btn = document.getElementById('answer-box').getElementsByClassName('mdui-btn')[2];
    if (document.getElementById('jump-btn-group').getElementsByClassName('mdui-color-theme-accent').length >= answer_object.data.length) submit_btn.classList.remove('mdui-hidden');
    else submit_btn.classList.add('mdui-hidden');
    loadProblem(0);
}

function loadProblem(serial) {
    if (serial < 0 || serial >= answer_object) return;
    let box = document.getElementById('answer-box');
    box.setAttribute('style', 'animation: fade-in 0.3s ease;');
    setTimeout(function() { box.removeAttribute('style'); }, 300);
    let title = box.getElementsByClassName('mdui-typo-title')[0];
    title.innerHTML = (serial + 1) + '. ' + answer_object.data[serial].question;
    let form = document.getElementById('answer-form');
    form.innerHTML = '';
    let option_resource, option_resource_number = 0;
    for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
        if (answer_object.data[serial].options[i].url != '') {
            option_resource_number ++;
            if (option_resource_number == 1) option_resource = answer_object.data[serial].options[i];
        }
    }
    if (answer_object.data[serial].type == 2) {
        for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
            form.innerHTML += 
            (i > 0 ? '<br>' : '') +
            '<label class="mdui-checkbox">' +
            '    <input type="checkbox" onclick="changeAnswer(' + serial + ',' + i + ')" ' + (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? 'checked ' : '') + '/>' +
            '    <i class="mdui-checkbox-icon"></i>' +
            '    ' + String.fromCharCode('A'.charCodeAt(0) + i) + '. ' + answer_object.data[serial].options[i].txt +
            '</label>' +
            (answer_object.data[serial].options[i].url == '' || option_resource_number == 1 ? '' : '<br>' + (answer_object.data[serial].options[i].type == 1 ? '<img src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '">' : '<audio src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '" controls="controls" preload="auto"></audio>'));
        }
    } else {
        for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
            form.innerHTML += 
            (i > 0 ? '<br>' : '') +
            '<label class="mdui-radio">' +
            '    <input type="radio" name="answer" onclick="changeAnswer(' + serial + ',' + i + ')" ' + (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? 'checked ' : '') + '/>' +
            '    <i class="mdui-radio-icon"></i>' +
            '    ' + String.fromCharCode('A'.charCodeAt(0) + i) + '. ' + answer_object.data[serial].options[i].txt +
            '</label>' +
            (answer_object.data[serial].options[i].url == '' || option_resource_number == 1 ? '' : '<br>' + (answer_object.data[serial].options[i].type == 1 ? '<img src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '">' : '<audio src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '" controls="controls" preload="auto"></audio>'));
        }
    }
    let btns = box.getElementsByClassName('mdui-btn');
    btns[0].setAttribute('onclick', 'loadProblem(' + (serial - 1) + ')');
    btns[1].setAttribute('onclick', 'loadProblem(' + (serial + 1) + ')');
    if (serial < 1) btns[0].classList.add('mdui-hidden');
    else btns[0].classList.remove('mdui-hidden');
    if (serial >= answer_object.data.length - 1) btns[1].classList.add('mdui-hidden');
    else btns[1].classList.remove('mdui-hidden');
    let resource_box = document.getElementById('resource-box');
    resource_box.innerHTML = '';
    if (option_resource_number == 1) {
        if (option_resource.type == 1) resource_box.innerHTML += '<img src="' + getResourceLocalPath(option_resource.url) + '">';
        else resource_box.innerHTML += '<audio src="' + getResourceLocalPath(option_resource.url) + '" controls="controls" preload="auto"></audio>';
    }
    for (let i = 0; i < answer_object.data[serial].resources.length; i ++) {
        if (answer_object.data[serial].resources[i].type == 1) {
            resource_box.innerHTML += '<img src="' + getResourceLocalPath(answer_object.data[serial].resources[i].url) + '">';
        } else {
            resource_box.innerHTML += '<audio src="' + getResourceLocalPath(answer_object.data[serial].resources[i].url) + '" controls="controls" preload="auto"></audio>';
        }
    }
    if (answer_object.data[serial].question_audio != '') resource_box.innerHTML += '<audio src="' + getResourceLocalPath(answer_object.data[serial].question_audio) + '" controls="controls" preload="auto"></audio>';
    let jump_btn_group = document.getElementById('jump-btn-group');
    jump_btn_group.getElementsByClassName('mdui-btn-active')[0].classList.remove('mdui-btn-active');
    jump_btn_group.getElementsByClassName('mdui-btn')[serial].classList.add('mdui-btn-active');
}

function changeAnswer(problem, number) {
    if (answer_object.data[problem].type == 2) {
        if (checked_answer[problem].indexOf(answer_object.data[problem].options[number].serial) == -1) {
            checked_answer[problem].push(answer_object.data[problem].options[number].serial);
        } else {
            checked_answer[problem].splice(checked_answer[problem].indexOf(answer_object.data[problem].options[number].serial), 1);
        }
    } else {
        if (checked_answer[problem].length >= 1) checked_answer[problem].pop();
        checked_answer[problem].push(answer_object.data[problem].options[number].serial);
    }
    let jump_btns = document.getElementById('jump-btn-group').getElementsByClassName('mdui-btn');
    if (checked_answer[problem].length == 0) {
        jump_btns[problem].classList.remove('mdui-color-theme-accent');
    } else {
        jump_btns[problem].classList.add('mdui-color-theme-accent');
    }
    let submit_btn = document.getElementById('answer-box').getElementsByClassName('mdui-btn')[2];
    if (document.getElementById('jump-btn-group').getElementsByClassName('mdui-color-theme-accent').length >= answer_object.data.length || document.getElementById('show-submit-btn').getElementsByClassName('mdui-icon')[0].innerHTML == 'visibility') submit_btn.classList.remove('mdui-hidden');
    else submit_btn.classList.add('mdui-hidden');
    let progress = document.getElementsByClassName('mdui-card')[0].getElementsByClassName('mdui-progress-determinate')[0];
    progress.setAttribute('style', 'width: ' + document.getElementById('jump-btn-group').getElementsByClassName('mdui-color-theme-accent').length / answer_object.data.length * 100 + '%;');
    let back = document.getElementById('back-btn');
    if (document.getElementById('jump-btn-group').getElementsByClassName('mdui-color-theme-accent').length == 0) back.outerHTML = '<button class="mdui-btn" id="back-btn" onclick="loadExamList(' + backList + ')"><i class="mdui-icon material-icons">arrow_back</i> 返回</button>';
    else back.outerHTML = '<button class="mdui-btn" id="back-btn" mdui-dialog="{target: \'#back-dialog\'}"><i class="mdui-icon material-icons">arrow_back</i> 返回</button>';
}

function submitAnswer() {
    let submit_btn = document.getElementById('answer-box').getElementsByClassName('mdui-btn')[2];
    submit_btn.classList.add('mdui-hidden');
    let jump_btn_group = document.getElementById('jump-btn-group');
    jump_btn_group.innerHTML = '';
    for (let i = 0; i < answer_object.data.length; i ++) {
        jump_btn_group.innerHTML += '<button class="mdui-btn" onclick="loadAnswer(' + i + ')">' + (i + 1) + '</button>';
    }
    let jump_btns = jump_btn_group.getElementsByClassName('mdui-btn');
    for (let i = 0; i < answer_object.data.length; i ++) {
        checked_answer[i].sort();
        answer_object.data[i].answer.sort();
        if (checked_answer[i].toString() == answer_object.data[i].answer.toString()) {
            jump_btns[i].classList.remove('mdui-color-theme-accent');
            jump_btns[i].classList.add('mdui-color-green-accent');
        } else {
            jump_btns[i].classList.remove('mdui-color-theme-accent');
            jump_btns[i].classList.add('mdui-color-red-accent');
        }
    }
    jump_btn_group.getElementsByClassName('mdui-btn')[0].classList.add('mdui-btn-active');
    let analyse_box = document.getElementById('analyse-box');
    analyse_box.classList.remove('mdui-hidden');
    document.getElementById('show-submit-btn').classList.add('mdui-hidden');
    loadAnswer(0);
}

function loadAnswer(serial) {
    if (serial < 0 || serial >= answer_object) return;
    let box = document.getElementById('answer-box');
    box.setAttribute('style', 'animation: fade-in 0.3s ease;');
    setTimeout(function() { box.removeAttribute('style'); }, 300);
    let title = box.getElementsByClassName('mdui-typo-title')[0];
    title.innerHTML = (serial + 1) + '. ' + answer_object.data[serial].question;
    let form = document.getElementById('answer-form');
    form.innerHTML = '';
    let option_resource, option_resource_number = 0;
    for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
        if (answer_object.data[serial].options[i].url != '') {
            option_resource_number ++;
            if (option_resource_number == 1) option_resource = answer_object.data[serial].options[i];
        }
    }
    if (answer_object.data[serial].type == 2) {
        for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
            form.innerHTML += 
            (i > 0 ? '<br>' : '') +
            '<label class="mdui-checkbox disable-click"' + (answer_object.data[serial].answer.indexOf(answer_object.data[serial].options[i].serial) != -1 ? (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? ' checked' : ' true') : (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? ' false' : '')) + '>' +
            '    <input type="checkbox" ' + (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 || answer_object.data[serial].answer.indexOf(answer_object.data[serial].options[i].serial) != -1 ? 'checked ' : '') + '/>' +
            '    <i class="mdui-checkbox-icon"></i>' +
            '    ' + String.fromCharCode('A'.charCodeAt(0) + i) + '. ' + answer_object.data[serial].options[i].txt +
            '</label>' +
            (answer_object.data[serial].options[i].url == '' || option_resource_number == 1 ? '' : '<br>' + (answer_object.data[serial].options[i].type == 1 ? '<img src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '">' : '<audio src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '" controls="controls" preload="auto"></audio>'));
        }
    } else {
        for (let i = 0; i < answer_object.data[serial].options.length; i ++) {
            form.innerHTML += 
            (i > 0 ? '<br>' : '') +
            '<label class="mdui-radio disable-click"' + (answer_object.data[serial].answer.indexOf(answer_object.data[serial].options[i].serial) != -1 ? (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? ' checked' : ' true') : (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 ? ' false' : '')) + '>' +
            '    <input type="radio" name="answer' + i + '" ' + (checked_answer[serial].indexOf(answer_object.data[serial].options[i].serial) != -1 || answer_object.data[serial].answer.indexOf(answer_object.data[serial].options[i].serial) != -1 ? 'checked ' : '') + '/>' +
            '    <i class="mdui-radio-icon"></i>' +
            '    ' + String.fromCharCode('A'.charCodeAt(0) + i) + '. ' + answer_object.data[serial].options[i].txt +
            '</label>' +
            (answer_object.data[serial].options[i].url == '' || option_resource_number == 1 ? '' : '<br>' + (answer_object.data[serial].options[i].type == 1 ? '<img src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '">' : '<audio src="' + getResourceLocalPath(answer_object.data[serial].options[i].url) + '" controls="controls" preload="auto"></audio>'));
        }
    }
    let analyse_box = document.getElementById('analyse-box');
    analyse_box.innerHTML = '<span class="mdui-text-color-theme-accent">答案解析：</span>' + answer_object.data[serial].analyse.txt;
    let btns = box.getElementsByClassName('mdui-btn');
    btns[0].setAttribute('onclick', 'loadAnswer(' + (serial - 1) + ')');
    btns[1].setAttribute('onclick', 'loadAnswer(' + (serial + 1) + ')');
    if (serial < 1) btns[0].classList.add('mdui-hidden');
    else btns[0].classList.remove('mdui-hidden');
    if (serial >= answer_object.data.length - 1) btns[1].classList.add('mdui-hidden');
    else btns[1].classList.remove('mdui-hidden');
    let resource_box = document.getElementById('resource-box');
    resource_box.innerHTML = '';
    if (option_resource_number == 1) {
        if (option_resource.type == 1) resource_box.innerHTML += '<img src="' + getResourceLocalPath(option_resource.url) + '">';
        else resource_box.innerHTML += '<audio src="' + getResourceLocalPath(option_resource.url) + '" controls="controls" preload="auto"></audio>';
    }
    for (let i = 0; i < answer_object.data[serial].resources.length; i ++) {
        if (answer_object.data[serial].resources[i].type == 1) {
            resource_box.innerHTML += '<img src="' + getResourceLocalPath(answer_object.data[serial].resources[i].url) + '">';
        } else {
            resource_box.innerHTML += '<audio src="' + getResourceLocalPath(answer_object.data[serial].resources[i].url) + '" controls="controls" preload="auto"></audio>';
        }
    }
    if (answer_object.data[serial].question_audio != '') resource_box.innerHTML += '<audio src="' + getResourceLocalPath(answer_object.data[serial].question_audio) + '" controls="controls" preload="auto"></audio>';
    let jump_btn_group = document.getElementById('jump-btn-group');
    jump_btn_group.getElementsByClassName('mdui-btn-active')[0].classList.remove('mdui-btn-active');
    jump_btn_group.getElementsByClassName('mdui-btn')[serial].classList.add('mdui-btn-active');
    let progress = document.getElementsByClassName('mdui-card')[0].getElementsByClassName('mdui-progress-determinate')[0];
    progress.setAttribute('style', 'width: ' + serial / answer_object.data.length * 100 + '%;');
}

function getResourceLocalPath(url) {
    if (isUseOrigin) return url;
    else return 'resource/' + url.split('/').slice(-2).join('/');
}

function showSubmitButton() {
    let submit_btn = document.getElementById('answer-box').getElementsByClassName('mdui-btn')[2];
    let icon = document.getElementById('show-submit-btn').getElementsByClassName('mdui-icon')[0];
    if (submit_btn.classList.contains('mdui-hidden')) {
        submit_btn.classList.remove('mdui-hidden');
        icon.innerHTML = 'visibility';
    } else {
        submit_btn.classList.add('mdui-hidden');
        icon.innerHTML = 'visibility_off';
    }
}

function changeResourceOrigin() {
    let btn = document.getElementById('change-source');
    let icon = btn.getElementsByClassName('mdui-icon')[0];
    let tooltips = document.getElementsByClassName('mdui-tooltip');
    isUseOrigin = !isUseOrigin;
    if (isUseOrigin) {
        icon.innerHTML = 'flash_on';
        btn.setAttribute('mdui-tooltip', '{content: \'使用 官方 源\'}');
        for (let i = 0; i < tooltips.length; i ++) {
            if (tooltips[i].innerHTML == '使用 GitHub 源')
                tooltips[i].innerHTML = '使用 官方 源';
        }
    } else {
        icon.innerHTML = 'flash_off';
        btn.setAttribute('mdui-tooltip', '{content: \'使用 GitHub 源\'}');
        for (let i = 0; i < tooltips.length; i ++) {
            if (tooltips[i].innerHTML == '使用 官方 源')
                tooltips[i].innerHTML = '使用 GitHub 源';
        }
    }
}

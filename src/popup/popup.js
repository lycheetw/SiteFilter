'use strict';
const SITES_LIST_STORAGE_KEY = "__SITE_LIST__"
const form = document.querySelector("form");

loadStorage();

form.onsubmit = (e) => {
    e.preventDefault();
    let url = newSiteInput.value;
    if(url.length == 0) return;
    url = url.replace(/^(https?:\/\/)/,"");
    url = url.replace(/\/.*/,"");
    addNewSite(url, true);
    updateStorage();
    newSiteInput.value = "";
    $('.scroll_block').animate({
        scrollTop: $("#body_table").height()
    }, 500, function(){
        
    });
};

const newSiteInput = document.querySelector("#new_site_input");

// const settingBtn = document.querySelector("#setting_btn");
// settingBtn.onclick = openNewPage;

document.addEventListener("click", (e) => {
    console.log(e);
    if(e.target.tagName == "I") {
        e.path[3].removeChild(e.path[2]);
        updateStorage();
    } else if (e.target.tagName == "INPUT") {
        updateStorage();
    }

}, false)

function openNewPage(e) {
    chrome.tabs.create({
        url: '/setting.html'
    });
}

function addNewSite(url, block) {
    const tbody = document.querySelector("#body_table").lastElementChild;
    const switchStr = `
        <label class="switch">
            <input type="checkbox" ${block ? "checked" : ""}>
            <span class="slider round"></span>
        </label>
    `
    const rowStr = `
    <tr scope="row">
        <td>${url}</td>
        <td>${switchStr}</td>
        <td><i class="material-icons">delete</i></td>
    </tr>`
    tbody.insertAdjacentHTML( 'beforeend', rowStr );
}

function updateStorage() {
    const ary = Array.apply(null, document.querySelectorAll("#body_table tr"));
    const data = ary.map(tr => {
        return {
            site: tr.children[0].textContent, block: tr.children[1].querySelector("input").checked
        }
    })
    
    chrome.storage.local.set({list: data}, () => {
        console.log("Save complete.");
    })
}

function loadStorage() {
    chrome.storage.local.get({list: []}, (result) => {
        result.list.map(it => {
            addNewSite(it.site, it.block);
        })
    })
}

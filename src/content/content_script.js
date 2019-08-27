

var siteList = [];

chrome.storage.local.get({list: []}, result => {
    siteList = result.list;
    findAndUpdateNodes();
})

chrome.storage.onChanged.addListener((changes, namespace) => {
    chrome.storage.local.get({list: []}, result => {
        siteList = result.list;
        findAndUpdateNodes();
    })
})

function findAndUpdateNodes() {
    document.querySelectorAll(".srg").forEach(srgNode => {
        const parentNode = srgNode.parentNode;
        parentNode.childNodes.forEach(resultNodeLv1 => {
            resultNodeLv1.childNodes.forEach(resultNodeLv2 => {
                resultNodeLv2.childNodes.forEach(resultNodeLv3 => {
                    markNode(resultNodeLv3);
                })
            })
        })
    })
}

function markNode(node) {
    siteList.forEach(it => {
        try {
            const a = node.querySelector("a");
            if(a != undefined && a.href.includes(`//${it.site}`)) {
                node.classList.add("blocked-translucent");
                if(it.block) {
                    node.classList.add("blocked-hide");
                } else {
                    node.classList.remove("blocked-hide");
                }
            }
        } catch(e) {

        }
    });
}
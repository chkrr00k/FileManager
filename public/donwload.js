//made by chkrr00k
function cleanHTML(str){
	return str.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/'/g, "&apos;")
			.replace(/"/g, "&quot;");
}

var presentFiles = undefined;

function renderFile(f){
        return "<tr><td>" + f + "</td><td> <a href='download/" + f + "' target='_blank'>Download</a> </td></tr>"
}

function renderPage(input){
        let files = document.getElementById("files");
        let res = "<th>Name</th><th></th>";
        input.forEach((e) => {
                res += renderFile(e);
        });
        files.innerHTML = res;
}

function fetch(url){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			presentFiles = JSON.parse(xhr.responseText);
                        renderPage(presentFiles);

		}
	};
	xhr.send(JSON.stringify({request :"list"}));
}

function load(){
        let updBtn = document.getElementById("update");
        updBtn.onclick = () => {
                fetch("/list");
        };
	fetch("/list");
}

//made by chkrr00k
function cleanHTML(str){
	return str.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/'/g, "&apos;")
			.replace(/"/g, "&quot;");
}

class FileEntry{
	constructor(f, id=-1){
		this.name = id;
		this.file = f;
		this.uploaded = false;
	}
	
	equals(other){
		return other.name == this.name && other.file == this.file;
	}
	
	toString(){
		return "<tr>" 
			+ "<td>" + cleanHTML(this.file.name) + "</td>" 
			+ "<td>" + new Date(this.file.lastModified) + "</td>" 
			+ "<td>" + (this.file.size / 1024).toFixed(2) + " KiB</td>" 
			+ "<td>" + this.file.type + "</td>" 
			+ "<td><button onclick=\'javascript:remove(" + this.name + ", this)\' class=\"delete\">Delete</button></td>"
			+ "</tr>"
	}
	
	upload(url){
		return new Promise((resolve, reject) => {
			let fd = new FormData();
			let xhr = new XMLHttpRequest();
			
			fd.append("file", this.file);
			xhr.open("POST", url, true);
			xhr.onreadystatechange = function () {
			if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				this.uploaded = true;
				resolve(xhr.responseText);
			}
};
			xhr.onerror = () => reject(xhr.status);
			
			xhr.send(fd);
		});
	}
}

class FileStorage{
	constructor(){
		this.map = new Map();
		this.current = 0;
	}
	append(f){
		if(!this.map.get(f.name)){
			f.name = this.current++;
			this.map.set(f.name, f);
			return true;
		}else{
			return false;
		}
	}
	
	remove(f){
		this.map.delete(f);
	}
	
	forEach(f){
		this.map.forEach((e) => {
			f(e);
		});
	}
}

var uploadFiles = new FileStorage();

function load(){
	function createNode(parent, text=""){
		let d = document.createElement("li");
		let n = document.createTextNode(text);
		d.appendChild(n);
		parent.appendChild(d);
	}
	
	let file = document.getElementById("uFile");
	let parent = document.getElementById("files");
	
	file.onchange = () => {
		let tmp = undefined;
		
		for(f of file.files){
			tmp = new FileEntry(f);
			if(uploadFiles.append(tmp)){
				parent.innerHTML += tmp.toString();
			}
		}
	};
	let uploadB = document.getElementById("upload");
	let errorText = document.getElementById("errorText");
	let errorBox = document.getElementById("error");
	uploadB.onclick = () => {
		uploadFiles.forEach((e) => {
			e.upload("/upload").catch((err) => {
				errorText.innerHTML = "Upload of " + e.name + " failed " + err;
				errorBox.style.display = "block";
			});
			uploadFiles.remove(e.name);			
		});
		refresh();
	};
	let delBtn = document.getElementById("deleteBtn");
	delBtn.onclick = () => {
		errorBox.style.display = "none";
	};
}

function remove(f, t){
	uploadFiles.remove(f);
	t.parentNode.parentNode.parentNode.remove();
}

function refresh(){
	let parent = document.getElementById("files");
	parent.innerHTML = "<tr><th>Name</th><th>Last modified</th><th>Size</th><th>Type</th><th></th> </tr>";
	uploadFiles.forEach((e) => {
		parent.innerHTML += e.toString();
	});
}

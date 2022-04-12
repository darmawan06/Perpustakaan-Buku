let dataBooks = [];
let nameStorage = 'dataBooks';
const checkStorage = ()=>{
	if (typeof(Storage)) {
		if(localStorage.getItem(nameStorage) == null){
			localStorage.setItem(nameStorage,JSON.stringify(dataBooks));
		}
	}
}
checkStorage();
const addBook = ()=>{
	const formAdd = document.getElementById('formAdd');
	formAdd.addEventListener('submit',(event)=>{
		let valueJudul = event.target[0].value
		let valuePenulis = event.target[1].value
		let valueTahun = event.target[2].value
		let valueBaca = event.target[3].checked
		if(valueJudul != null && valuePenulis != null && valueTahun != null){
			dataBooks.push({
				id : + new Date(),
				title : valueJudul,
				author : valuePenulis,
				year : valueTahun,
				isComplete : valueBaca
			})
			localStorage.setItem(nameStorage,JSON.stringify(dataBooks))
			reloadBook(dataBooks)
		}
		event.preventDefault()
	})
};

const openAlertdelete = (id)=>{
	let selectedBook;
	for(i in dataBooks){
		if(id == dataBooks[i].id){
			selectedBook = dataBooks[i];
		}
	}

	const stucturedHtml = `
		<section id="alertDelete">
			<div class="area">
				<span>Apakah anda yakin akan menghapus buku berjudul <i>${selectedBook.title}</i> dengan penulis <i>${selectedBook.author}</i> yang dibuat pada tahun <i>${selectedBook.year}</i> ?</span>
				<div class="btn">
					<button id='${selectedBook.id}' class="yes" onclick = 'deleteBook(this.id)'>Iya</button>
					<button class="no" onclick = 'cancelDelete()'>Tidak</button>
				</div>
			</div>
		</section>`;
	document.getElementsByTagName('main')[0].innerHTML += stucturedHtml;
}

const cancelDelete = ()=>{
	document.getElementById('alertDelete').remove();
}
const deleteBook = (id)=>{
	for(i in dataBooks){
		if(id == dataBooks[i].id){
			dataBooks.splice(i,1)
			localStorage.setItem(nameStorage,JSON.stringify(dataBooks))
			reloadBook(dataBooks)
			break;
		}
	}

	document.getElementById('alertDelete').remove();
}

const moveBook = (id)=>{
	for(i in dataBooks){
		if(id == dataBooks[i].id){
			if (dataBooks[i].isComplete){
				dataBooks[i].isComplete = false
			}else{
				dataBooks[i].isComplete = true	
			}
			localStorage.setItem(nameStorage,JSON.stringify(dataBooks))
			reloadBook(dataBooks)
			break;
		}
	}
}

const reloadBook = (value)=>{
	const booksComplete = document.getElementById('booksIsComplete');
	const booksNotComplete = document.getElementById('booksIsNotComplete');
	booksComplete.innerHTML = "<h2>Buku Selesai Di Baca</h2>";
	booksNotComplete.innerHTML = "<h2>Buku Belum Selesai Di Baca</h2>";
	// Proses Create Element
	for(i in value){
		let tamp = '';
		if (value[i].isComplete){
			tamp = "Belum Selesai Dibaca"
		}else{
			tamp = "Selesai Dibaca";
		}

		let divItem =`
			<div class = 'item'>
				<div>
					<h3>${value[i].title}</h3>
					<span>
						Nama Penulis:${value[i].author}
						<br>
						Tahun : ${value[i].year}
					</span>						
				</div>
				<div class="btn">
					<button id='${value[i].id}' onclick = 'moveBook(this.id)'>${tamp}</button>
					<button id='${value[i].id}' onclick = 'openAlertdelete(this.id)'>Hapus Buku</button>
				</div>
			</div>
		`;
		if (value[i].isComplete){
			booksComplete.innerHTML += divItem;
		}else{
			booksNotComplete.innerHTML += divItem;
		}
	}
}



const searchBook = (value)=>{

	const hideItem = (value,book)=>{
		for (var i = book.length - 1; i >= 0; i--) {
				const title = book[i].childNodes[1].childNodes[1].innerText;
				if (title.toUpperCase().indexOf(value.toUpperCase()) > -1) {
					book[i].style.display = 'flex'
				}else{
					book[i].style.display = 'none';
				}
		}
	}

	let formSearch = document.getElementById('formSearch');
	let booksComplete = document.getElementById('booksIsComplete').getElementsByClassName('item');
	let booksNotComplete = document.getElementById('booksIsNotComplete').getElementsByClassName('item');
	formSearch.addEventListener('submit',(event)=>{
		event.preventDefault();
		const valueSearch = event.target[0].value;
		hideItem(valueSearch,booksComplete);
		hideItem(valueSearch,booksNotComplete);
	})
}

window.addEventListener('load',()=>{
	dataBooks = JSON.parse(localStorage.getItem(nameStorage));
	reloadBook(dataBooks)
	addBook()
	searchBook();
})
class Book {
  constructor(id, title, author, year, isComplete) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = parseInt(year);
    this.date = new Date().toLocaleDateString("id-ID");
    this.isComplete = isComplete;
  }
}

class Library {
  constructor() {
    this.listBuku = [];
    this.listBukuPengembalian = [];
  }

  tambahBuku(title, year, author, lokasi) {
    const id = this.generateID();
    const buku = new Book(id, title, author, year, false);

    if (lokasi === "rakBukuPengembalian") {
      this.listBukuPengembalian.push(buku);
    } else {
      this.listBuku.push(buku);
    }

    this.saveBuku();
    this.displayBook(buku, lokasi);
  }

  generateID() {
    return +new Date();
  }

  displayBook(book, lokasi) {
    const rakBuku = document.querySelector(".list-bukuPinjam");
    const rakBukupengembalian = document.querySelector(".list-bukuPengembalian");
    const finishRead = document.querySelector("#finish-read");

    if (finishRead.checked === true) {
      lokasi = "rakBukuPengembalian";
      this.listBukuPengembalian.push(book);
      this.saveBuku();
    }

    const daftarBuku = document.createElement("li");
    const paragraph = document.createElement("p");

    paragraph.innerText = `ID : ${book.id}
    Title : ${book.title}
    Author : ${book.author}
    Year : ${book.year}
    Borrowing Date: ${book.date}`;

    daftarBuku.appendChild(paragraph);

    if (lokasi === "rakBukuPengembalian") {
      rakBukupengembalian.appendChild(daftarBuku);
    } else {
      rakBuku.appendChild(daftarBuku);
    }

    const functionButton = document.createElement("div");
    functionButton.classList.add("function-button");

    const finishButton = document.createElement("button");
    finishButton.classList.add("finish-button");
    finishButton.innerText = "Selesai";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "hapus";

    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.innerText = "Undo";

    // aktivasi event bubtton start
    finishButton.addEventListener("click", () => {
      const index = this.listBuku.findIndex((buku) => buku.id == book.id);

      this.listBukuPengembalian.push(this.listBuku[index]);
      this.listBuku.splice(index, 1);

      finishButton.remove();
      daftarBuku.remove();

      functionButton.appendChild(undoButton);
      functionButton.appendChild(deleteButton);
      this.saveBuku();

      rakBukupengembalian.appendChild(daftarBuku);
    });

    deleteButton.addEventListener("click", () => {
      const index = this.listBuku.findIndex((buku) => buku.id == book.id);
      const indexPengembalian = this.listBukuPengembalian.findIndex((buku) => buku.id == book.id);

      if (index !== -1) {
        this.listBuku.splice(index, 1);
        daftarBuku.remove();
        this.saveBuku();
      } else if (indexPengembalian !== -1) {
        this.listBukuPengembalian.splice(indexPengembalian, 1);
        daftarBuku.remove();
        this.saveBuku();
      }
    });

    undoButton.addEventListener("click", () => {
      const index = this.listBukuPengembalian.findIndex((buku) => buku.id == book.id);

      if (index !== -1) {
        this.listBuku.push(this.listBukuPengembalian[index]);
        this.listBukuPengembalian.splice(index, 1);
        daftarBuku.remove();

        this.saveBuku();
        this.displayBook(book, "rakBuku");
      }
    });
    // aktivasi event bubtton end

    if (lokasi === "rakBukuPengembalian") {
      functionButton.appendChild(undoButton);
      functionButton.appendChild(deleteButton);
    } else {
      functionButton.appendChild(finishButton);
      functionButton.appendChild(deleteButton);
    }

    daftarBuku.appendChild(functionButton);
  }

  saveBuku() {
    localStorage.setItem("listBuku", JSON.stringify(this.listBuku));
    localStorage.setItem("listBukuPengembalian", JSON.stringify(this.listBukuPengembalian));
    document.getElementById("form").reset();
  }

  loadSavedBooks() {
    const savedListBuku = localStorage.getItem("listBuku") || "[]";
    const savedListBukuPinjam = localStorage.getItem("listBukuPengembalian") || "[]";

    this.listBuku = JSON.parse(savedListBuku);
    this.listBukuPengembalian = JSON.parse(savedListBukuPinjam);

    this.listBuku.forEach((book) => this.displayBook(book, "rakBuku"));
    this.listBukuPengembalian.forEach((book) => this.displayBook(book, "rakBukuPengembalian"));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const library = new Library();
  library.loadSavedBooks();

  const form = document.getElementById("form");
  const finishRead = document.querySelector("#finish-read");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const judulBuku = document.getElementById("judulBuku").value;
    const tahun = document.getElementById("yearsBook").value;
    const author = document.getElementById("author").value;
    let lokasi = "rakBuku";

    if (finishRead.checked === true) {
      lokasi = "rakBukuPengembalian";
    }

    library.tambahBuku(judulBuku, tahun, author, lokasi);
  });
});

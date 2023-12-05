import { GitUsers } from "./gitUser.js";

export class favorite {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
    }

    save() {
        localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
    }

    checkUserLength() {
        if (this.entries.length === 0) {
          document.querySelector(".empty-state").style.display = ""
        } else {
          document.querySelector(".empty-state").style.display = "none"
        }
      }

    async add(username) {
        try {
            const userThere = this.entries.find(entry => entry.login.toLowerCase() === username);
            if (userThere) {
                throw new Error("User already")
            }

            const user = await GitUsers.search(username);
            if (user.login === undefined) {
                throw new Error("User not found")
            }

            this.entries = [user, ...this.entries];
            this.checkUserLength();
            this.update();
            this.save();

        } catch (error) {
            alert(error.message);
        }
    }

    delete(user) {
        const Filtered = this.entries.filter((entry) => entry.login !== user.login);
        this.entries = Filtered;
        this.update();
        this.checkUserLength();
        this.save();
    }
}

export class favoriteshowextends extends favorite {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector("table tbody");
        this.update();
        this.onadd();
        this.checkUserLength();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input');
            this.add(value);
        }
    }

    update() {
        this.removeTrs();

        this.entries.forEach((user) => {
            const row = this.createRow();
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector(".remove").onclick = () => {
                const OK = confirm('are you sure you want to delete this line?')

                if (OK) {
                    this.delete(user);
                }
            }

            this.tbody.append(row);
        })
    }

    createRow() {
        const tr = document.createElement("tr");
        tr.className = "grid";

        tr.innerHTML = `
            <td class="user grid-main">
                <img src="https://github.com/VinisTetsukoSato.png" alt="Foto do vinis"/>
                <a href="https://github.com/VinisTetsukoSato" target="_blank">
                    <p>Vinis Sato</p>
                    <span>VinisTetsukoSato</span>
                </a>
            </td>
            <td class="repositories grid-secondary">
                76
            </td>
            <td class="followers grid-secondary">
                9589
            </td>
            <td class="grid-secondary">
                <button class="remove">remover</button>
            </td>`
        return tr;
    }

    removeTrs() {
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove();
        })
    }
}
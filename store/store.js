import {makeAutoObservable} from "mobx";
import {$apiRoutes} from "../utils/routes";
import axios from "axios";


class Store {
    categories = []
    items = []
    category = 1
    type = 'products'
    loggedIn = false

    constructor() {
        makeAutoObservable(this)
    }

    setItems(data) {
        this.items = data
    }

    setCategory(id) {
        this.category = id
    }

    setType(type) {
        this.type = type
    }

    setCategories(data) {
        this.categories = data
    }

    findItemById(id) {
        return this.items.find(item => item.id === id)
    }

    setLoggedIn(bool) {
        this.loggedIn = bool
    }

    async requestItems() {
        axios.get($apiRoutes.items.list).then(rs => {
            if(rs.data.ok) this.setItems(rs.data.data)
        })
    }

    async requestCategories() {
        axios.get($apiRoutes.categories.list).then(rs => {
            if(rs.data.ok) this.setCategories(rs.data.data)
        })
    }
}

export default new Store()
import {makeAutoObservable} from "mobx";
import {$apiRoutes} from "../utils/routes";
import axios from "axios";


class Store {
    categories = []
    items = []
    category = null
    type = 'products'
    loggedIn = false
    isOrdersDrawerOpen = false
    user = null
    basket = []
    orders = []

    constructor() {
        makeAutoObservable(this)
    }

    setItems(data) {
        this.items = data
    }

    setBasket(items) {
        this.basket = items
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

    setUser(data) {
        this.user = data;
    }

    setIsOrdersDrawerOpen(bool) {
        this.isOrdersDrawerOpen = bool
    }

    getBasketSum(items) {
        let sum = 0
        if(!items) items = this.basket
        items.forEach(item => {
            sum += item.price
        })
        return sum
    }

    setOrders(data) {
        this.orders = data;
    }

    getItem(id) {
        return this.items.find(item => item._id === id)
    }

    async createItem(data) {
        const rs = await axios.post($apiRoutes.items.create, data)
        return rs.data;
    }

    async requestItems(filters) {
        const shuffleArray = array => {
            const shuffledArray = [...array]
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = shuffledArray[i];
                shuffledArray[i] = shuffledArray[j];
                shuffledArray[j] = temp;
            }
            return shuffledArray;
        }

        return await axios.get($apiRoutes.items.list + "?" + new URLSearchParams(filters).toString())
        // return await axios.get($apiRoutes.items.list).then(rs => {
        //     if(rs.data.ok) this.setItems(shuffleArray(rs.data.data))
        // })
    }

    async requestCategories() {
        await axios.get($apiRoutes.categories.list).then(rs => {
            if(rs.data.ok) this.setCategories(rs.data.data)
        })
    }

    async requestOrders() {
        await axios.get($apiRoutes.orders.list(this.user.id)).then(rs => {
            if(rs.data.ok) this.setOrders(rs.data.data)
        })
    }

    async requestBasket() {
        await axios.get($apiRoutes.basket.list(this.user.id)).then(rs => {
            if(rs.data.ok) this.setBasket(rs.data.data)
        })
    }

    async addBasket(item_id) {
        await axios.put($apiRoutes.basket.add, {
            user_id: this.user.id,
            item_id
        }).then(rs => {
            if(rs.data.ok) this.setBasket(rs.data.data)
        })
    }

    async createOrder(data, oneTimePay=false) {
        return await axios.post($apiRoutes.orders.create, {
            ...data,
            user: oneTimePay? null : this.user.id
        }).then(rs => {
            if(rs.data.ok) this.setBasket([])
            return rs.data
        })
    }

    async requestItemsCount() {
        return await axios.get($apiRoutes.items.list + "?" + new URLSearchParams({
            get: 'count',
            category: this.category,
            type: this.type,
        }).toString()).then(rs => {
            return rs.data;
        })
    }

    async removeBasket(item_id) {
        await axios.post($apiRoutes.basket.remove, {
            user_id: this.user.id,
            item_id
        }).then(rs => {
            if(rs.data.ok) this.setBasket(rs.data.data)
        })
    }

    async requestItem(id) {
        return await axios.get($apiRoutes.items.single(id)).then(rs => {
            return rs.data;
        })
    }
}

export default new Store()
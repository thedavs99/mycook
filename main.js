const app = Vue.createApp({
    data() {
        return {
            searchRestaurant: '',  
            showOrders: 0,
            listOrders: {
                awaiting: [],
                in_preparation: [],
                ready: []
            },
            selectedOrder: ''  
        };
    },

    computed: {
        selectedRestaurant() {
            return this.searchRestaurant ? this.searchRestaurant : null;
        }
    },

    methods: {

        async getData() {
            let response = await fetch(`http://localhost:3000/api/v1/restaurants/${this.selectedRestaurant}/orders`);
            
            if (response.status === 200){
                this.showOrders = 1
            }

            let data = await response.json();
            this.listOrders.awaiting = [];
            this.listOrders.in_preparation = [];
            this.listOrders.ready = [];
            
            data.forEach(item => {
                var order = new Object();
                
                order.code = item.Codigo,
                order.status = item.Status


                if (order.status === "Aguardando confirmação da cozinha") {
                    this.listOrders.awaiting.push(order);
                } else if (order.status === "Em preparação") {
                    this.listOrders.in_preparation.push(order);
                } else if (order.status === "Pronto") {
                    this.listOrders.ready.push(order);
                }
            });

            console.log('Pedidos classificados:', this.listOrders);
            console.log(this.showOrders);
        },

        async showDetails(order) {            
            let response = await fetch(`http://localhost:3000/api/v1/restaurants/${this.selectedRestaurant}/orders/${order.code}`);
            let orderDetails = await response.json();
            this.selectedOrder = orderDetails;
        },
    }
});

app.mount('#app');
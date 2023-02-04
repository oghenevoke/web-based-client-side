const app = new Vue({
    el: '#eLearingApp',
    data: {
        classes: [],
        cart: [],
        sortBy: "", //this is to sort by price, subject, location or availability/spaces
        orderBy: "", // to order in ascending or descending order
        search: "",// to search by subject and location
        name: "",
        phoneNumber: "",
        HomePage: true,
        disabled: [true, true],
        baseURL: 'http://localhost:4000'
    },
    created: function () {
        // fetch lessons from API on application launch
        this.fetchLessons();
    },
    computed: {

        //shows the number of items(spaces) of each subject being added to cart
        cartItemCount: function () {
            return this.cart.length || '';
        },
    },

    methods: {
        // method to fetch lessons from API
        fetchLessons() {
            fetch(`${this.baseURL}/collections/lessons`).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            // pushing lessons in json format into the lessons array
                            app.classes = json;
                        }
                    )
                });
        },
        // search lesson
        searchLessonsCollection(searchText) {
            fetch(`${this.baseURL}/collections/lessons/find/${searchText}`).then(
                function (response) {
                    response.json().then(
                        function (json) {
                            // pushing lessons in json format into the lessons array
                            app.classes = json;
                        }
                    )
                });
        },
        ///  save Order with POST
        postOrder(jsonData) {
            fetch(`${this.baseURL}/collections/orders`, {
                method: "POST",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        /// update lesson space
        updateLesson(jsonData, _id) {

            fetch(`${this.baseURL}/collections/lessons/${_id}`, {
                method: "PUT",
                body: JSON.stringify(jsonData),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //returns number of spaces greater than cartCount(lecture) boolean data type
        canAddToCart(lecture) {
            return lecture.spaces > 0;
        },
        //adds or pushes items to cart
        addToCart(lecture) {

            --lecture.spaces;
            var lectureInCart = this.cart.find(u => u.lessonId == lecture._id);
            console.log(lectureInCart);

            if (lectureInCart != null) {
                ++lectureInCart.spaces;
            } else {
                lectureInCart = { lessonId: lecture._id, spaces: 1, lecture: lecture };
                this.cart.push(lectureInCart);
            }
            console.log(this.cart)
        },
        //this is just saying they are equal to each other and whenever this method is used to toggle's to homepage when not and homepage and when not on home page to the check out page
        togglePage() {
            this.HomePage = !this.HomePage;
        },
        //removes items from cart and adds back the number of space
        removeFromCart(lessonId) {
            var itemInCart = this.cart.find(u => u.lessonId == lessonId);
            if (itemInCart.spaces == 1) {
                var index = this.cart.map(x => x.lessonId).indexOf(lessonId);
                this.cart.splice(index, 1);

                //when the cart is empty goes back to home page
                if (this.cart.length <= 0) {
                    this.togglePage();
                }
            } else {
                --itemInCart.spaces;
            }

            var lecture = this.classes.find(u => u._id == lessonId);
            ++lecture.spaces;

        },

        orderMessage() {
            console.log(this.cart);

            // insert and save new order
            this.cart.forEach((itemInCart) => {

                var order = {
                    lessonId: itemInCart.lessonId,
                    spaces: itemInCart.spaces,
                    name: this.name,
                    phoneNumber: this.phoneNumber
                };
                this.postOrder(order);

                // update available lesson space with put
                var lessonToUpdate = { spaces: itemInCart.lecture.spaces }
                this.updateLesson(lessonToUpdate, itemInCart.lessonId);
            });


            alert("Your Order has been successfully taken");
            window.location.reload();
        },

        isLetter(e) {
            const nameField = document.getElementById("name");
            let char = String.fromCharCode(e.keyCode);// Gets the character
            if (/^[A-Za-z]+$/.test(char)) {
                nameField.style.border = "green solid 3px";
                this.disabled = [false, this.disabled[1]]
            }
            else {
                nameField.style.border = "red solid 3px";
                this.disabled = [true, this.disabled[1]]
            }

        },

        isNumber(e) {
            const phoneNumberField = document.getElementById("phoneNumber");
            let char = String.fromCharCode(e.keyCode); // Gets the character
            if (/^[0-9]+$/.test(char)) {
                phoneNumberField.style.border = "green solid 3px";
                this.disabled = [this.disabled[0], false]
            }
            else {
                phoneNumberField.style.border = "red solid 3px";
                this.disabled = [this.disabled[0], true]
            }

        },
        // filter lesson based on sortBy selection
        sortClasses: function () {
            if (this.orderBy == 'ascending') {
                switch (this.sortBy) {
                    // filter by subject
                    case 'subject':
                        this.classes.sort((a, b) => {
                            let x = a.subject.toLowerCase();
                            let y = b.subject.toLowerCase();
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by location
                    case 'location':
                        this.classes.sort((a, b) => {
                            let x = a.location.toLowerCase();
                            let y = b.location.toLowerCase();
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by price
                    case 'price':
                        this.classes.sort((a, b) => {
                            let x = a.price;
                            let y = b.price;
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                    // filter by availability
                    case 'availability':
                        this.classes.sort((a, b) => {
                            let x = a.spaces;
                            let y = b.spaces;
                            if (x < y) { return -1; }
                            if (x > y) { return 1; }
                            return 0;
                        })
                        break;
                }
            } else {
                switch (this.sortBy) {
                    // filter by subject
                    case 'subject':
                        this.classes.sort((a, b) => {
                            let x = a.subject.toLowerCase();
                            let y = b.subject.toLowerCase();
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by location
                    case 'location':
                        this.classes.sort((a, b) => {
                            let x = a.location.toLowerCase();
                            let y = b.location.toLowerCase();
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by price
                    case 'price':
                        this.classes.sort((a, b) => {
                            let x = a.price;
                            let y = b.price;
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                    // filter by availability
                    case 'availability':
                        this.classes.sort((a, b) => {
                            let x = a.spaces;
                            let y = b.spaces;
                            if (x < y) { return 1; }
                            if (x > y) { return -1; }
                            return 0;
                        })
                        break;
                }
            }
        },

    },

    watch: {
        sortBy: function () {
            this.sortClasses();
        },
        orderBy: function () {
            this.sortClasses()
        },
        search: {
            handler(val) {
                console.log(val)
                if (val.trim() != '') {
                    this.searchLessonsCollection(val);
                } else {
                    this.fetchLessons();
                }
            },
        }
    }
});

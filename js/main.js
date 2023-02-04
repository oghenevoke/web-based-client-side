const app = new Vue({
    el: '#eLearingApp',
    data: {
        classes: [],
        cart: [], 
        sorting: "", //this is to sort by price, subject, location or availability/spaces
        order: "", // to order in ascending or descending order
        search: "",// to search by subject and location
        name: "", 
        phoneNumber: "",
        HomePage: true,
        disabled: [true, true]
    },

    computed: {
        //searches by subject and location
        searchSortLecture: function(){
            tempLecture = this.classes;
            
            if(this.search != "" && this.search){
                tempLecture = tempLecture.filter((lecture) => {
                    return(lecture.subject.toLowerCase().match(this.search.toLowerCase()) || lecture.location.toLowerCase().match(this.search.toLowerCase()));
                })
            }
            
            tempLecture = tempLecture.sort((a, b) => {
                if(this.order == "ascending"){
                    if (this.sorting == "subject"){
                        if (a.subject.toLowerCase() < b.subject.toLowerCase()){
                            return -1
                        }
                        if (a.subject.toLowerCase() > b.subject.toLowerCase()){
                            return 1
                        }
                        return 0
                    }
                    if (this.sorting == "location"){
                        if (a.location.toLowerCase() < b.location.toLowerCase()){
                            return -1
                        }
                        if (a.location.toLowerCase() > b.location.toLowerCase()){
                            return 1
                        }
                        return 0
                    }
                    if(this.sorting == "price"){
                        return a.price - b.price;
                    }
                    if (this.sorting == "space"){
                        return a.spaces - a.cartItemCount - (b.spaces - b.cartItemCount);
                    }
                }else if(this.order == "descending"){
                    if (this.sorting == "subject"){
                        if (a.subject.toLowerCase() < b.subject.toLowerCase()){
                            return 1
                        }
                        if (a.subject.toLowerCase() > b.subject.toLowerCase()){
                            return -1
                        }
                        return 0
                    }
                    if (this.sorting == "location"){
                        if (a.location.toLowerCase() < b.location.toLowerCase()){
                            return 1
                        }
                        if (a.location.toLowerCase() > b.location.toLowerCase()){
                            return -1
                        }
                        return 0
                    }
                    if(this.sorting == "price"){
                        return b.price - a.price;
                    }
                    if (this.sorting == "space"){
                            return b.spaces - b.cartItemCount - (a.spaces - a.cartItemCount);         
                    }
                }
            });
            
            return tempLecture;
        },
        //shows the number of items(spaces) of each subject being added to cart
        cartItemCount: function() {
            return this.cart.length || '';
        },
    },

    methods: {
        //returns number of spaces greater than cartCount(lecture) boolean data type
        canAddToCart(lecture) {
            return lecture.spaces > this.cartCount(lecture);
        },
        //adds or pushes items to cart
        addToCart (lecture) {
            this.cart.push(lecture);
            // console.log(lecture.id)
        },
        //counting the number of items(spaces) being added to cart
        cartCount(lecture) {
            let count = 0;
                for(var i = 0; i < this.cart.length; i++) {                        
                    if (this.cart[i] === lecture) {
                        count++;
                    }
                }
            return count;
          },
    
        //this is just saying they are equal to each other and whenever this method is used to toggle's to homepage when not and homepage and when not on home page to the check out page
        togglePage(){
            this.HomePage = !this.HomePage;
        },
        //removes items from cart and adds back the number of space
        removeFromCart(){
            this.cart.splice(this.cart.lecture, 1);

            //when the cart is empty goes back to home page
            if(this.cart.length <= 0){
                this.togglePage();
            }
        },

        orderMessage() {
            alert("Your Order has been successfully taken");
            window.location.reload();
          },

        isLetter(e) {
            const nameField = document.getElementById("name");
            let char = String.fromCharCode(e.keyCode);// Gets the character
            if(/^[A-Za-z]+$/.test(char)) {
                nameField.style.border = "green solid 3px";
                this.disabled = [false, this.disabled[1]]
            } 
            else{
                nameField.style.border = "red solid 3px";
                this.disabled = [true, this.disabled[1]]
            } 
            
          },

        isNumber(e) {
            const phoneNumberField = document.getElementById("phoneNumber");
            let char = String.fromCharCode(e.keyCode); // Gets the character
            if(/^[0-9]+$/.test(char)){
                phoneNumberField.style.border = "green solid 3px";
                this.disabled = [this.disabled[0], false]
            } 
            else{
                phoneNumberField.style.border = "red solid 3px";
                this.disabled = [this.disabled[0], true]
            }
            
          }, 

    },
});

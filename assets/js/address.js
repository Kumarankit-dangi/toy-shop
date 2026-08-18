// Load addresses
let editIndex = -1;
let addresses = JSON.parse(localStorage.getItem("addresses")) || [];

const addressList = document.getElementById("address-list");
const saveBtn = document.getElementById("save-address");

renderAddresses();

saveBtn.addEventListener("click", () => {

    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;

    if (
        fullname === "" ||
        phone === "" ||
        address === "" ||
        city === "" ||
        state === "" ||
        pincode === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const newAddress = {

    fullname,
    phone,
    address,
    city,
    state,
    pincode,
    default:false

};

if(editIndex===-1){

    newAddress.default = addresses.length===0;

    addresses.push(newAddress);

}else{

    newAddress.default = addresses[editIndex].default;

    addresses[editIndex]=newAddress;

    editIndex=-1;

}

    localStorage.setItem("addresses", JSON.stringify(addresses));

    clearForm();

    renderAddresses();

});

function renderAddresses() {

    addressList.innerHTML = "";

    addresses.forEach((item, index) => {

        addressList.innerHTML += `

        <div class="saved-address">

            <h3>${item.fullname}</h3>

            <p>${item.phone}</p>

            <p>${item.address}</p>

            <p>${item.city}, ${item.state} - ${item.pincode}</p>

            ${item.default ? "<span class='default-badge'>Default</span>" : ""}

            <div class="address-buttons">

                <button onclick="setDefault(${index})">
                    Set Default
                </button>
                <button onclick="editAddress(${index})">
                      Edit
                    </button>

                <button onclick="deleteAddress(${index})">
                    Delete
                </button>

            </div>

        </div>

        `;

    });

}

function deleteAddress(index){

    addresses.splice(index,1);

    localStorage.setItem("addresses",JSON.stringify(addresses));

    renderAddresses();

}

function setDefault(index){

    addresses.forEach(address=>address.default=false);

    addresses[index].default=true;

    localStorage.setItem("addresses",JSON.stringify(addresses));

    renderAddresses();

}

function clearForm(){

    document.getElementById("fullname").value="";
    document.getElementById("phone").value="";
    document.getElementById("address").value="";
    document.getElementById("city").value="";
    document.getElementById("state").value="";
    document.getElementById("pincode").value="";

}
function editAddress(index){

    editIndex = index;

    document.getElementById("fullname").value = addresses[index].fullname;
    document.getElementById("phone").value = addresses[index].phone;
    document.getElementById("address").value = addresses[index].address;
    document.getElementById("city").value = addresses[index].city;
    document.getElementById("state").value = addresses[index].state;
    document.getElementById("pincode").value = addresses[index].pincode;

}
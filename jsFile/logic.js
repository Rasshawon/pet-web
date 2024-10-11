let allPets = [];

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button onclick="loadByCategoryName('${item.category}')"  class="flex justify-evenly items-center md:px-14 md:py-4 px-2  border-gray-400 border-2 rounded-lg">
      <img class="md:w-full w-[25px] object-cover" src="${item.category_icon}" alt="" />
      <h2 class="p-2 md:text-lg text-sm font-bold">${item.category}</h2>
    </button>
    `;
    categoryContainer.append(buttonContainer);
  });
};

const loadAllPets = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
      allPets = data.pets;
      displayAllPets(allPets);
    })
    .catch((error) => console.log(error));
};

const displayAllPets = (pets) => {
  const cardSectionContainer = document.getElementById("pet-card");

  cardSectionContainer.innerHTML = "";

  pets.forEach((pet) => {
    const cardContainer = document.createElement("div");
    cardContainer.innerHTML = `
      <section >
        <div class="p-2">
        <div class= "p-4 shadow-xl rounded-lg">
          <img class="lg:h-[160px] w-full object-cover rounded-lg mx-auto" src="${
            pet.image
          }" alt="" />
          <div>
          <h3 class="font-bold text-lg">${pet.pet_name}</h3>
            <div class="flex items-center gap-1">
              <img  src="/images/Frame.png" alt="" /> ${
                pet.breed || "Not Available"
              }
            </div>
            <div class="flex items-center gap-1">
              <p><span><i class="fa-regular fa-calendar"></i></span> Birth: ${
                pet.date_of_birth || "Not Available"
              }</p>
            </div>
            <div class="flex items-center gap-1">
              <img class="size-4" src="https://img.icons8.com/?size=100&id=11780&format=png&color=000000" alt="" /> Gender: ${
                pet.gender || "Not Available"
              }
            </div>
            <div class="flex items-center gap-1">
              <img class="size-4" src="https://img.icons8.com/?size=100&id=aTrWEDlg4xEW&format=png&color=000000" alt="" /> Price: ${
                pet.price || "Not Available"
              }
            </div>
          </div>
          <div class="flex justify-between mt-2 ">
            <button class="text-[#0E7A81] font-semibold   py-2 md:px-4 px-2  shadow-lg border-2 border-teal-200 rounded-lg" onclick="addToLikeContainer('${
              pet.image
            }')">
              <i class="fa-regular fa-thumbs-up"></i>
            </button>
            <button class="text-[#0E7A81] font-semibold  py-2 md:px-4 px-2  shadow-lg border-2 border-teal-200 rounded-lg" onclick="adoptPet(this)" >Adopt</button>
           <button class="text-[#0E7A81] font-semibold py-2 md:px-4 px-2 shadow-lg border-2 border-teal-200 rounded-lg" onclick="fetchPetDetails(${
             pet.petId
           })">Details</button>

          </div></div>
        </div>
      </section>
    `;
    cardSectionContainer.append(cardContainer);
  });
};

const addToLikeContainer = (img) => {
  const likeContainer = document.getElementById("like-btn");
  const imgElement = document.createElement("img");
  imgElement.src = img;
  imgElement.classList.add(
    "md:h-[150px]",
    "h-full",
    "md:w-fit",
    "w-full",
    "object-cover",
    "md:gap-5",
    "gap-2",
    "shadow-md",
    "p-2"
  );
  likeContainer.appendChild(imgElement);
};

const sortPets = () => {
  const sortedPets = [...allPets].sort(
    (a, b) => (b.price || 0) - (a.price || 0)
  ); // Sort by price
  displayAllPets(sortedPets); // Display the sorted pets
};

const loadByCategoryName = (categoryName) => {
  const preloader = document.getElementById("preloader");
  const cardContainer = document.getElementById("pet-card");
  const categoryContainer = document.getElementById("display-pet");

  categoryContainer.classList.add("hidden");
  // Show preloader inside the card container
  preloader.classList.remove("hidden");

  // Simulate a 2-second delay
  setTimeout(() => {
    fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          displayAllPets(data.data); // Display the fetched data
        } else {
          cardContainer.classList.remove("grid");
          cardContainer.innerHTML = `<div class="bg-[#F8F8F8] mx-auto text-center mr-4">
            <div class="py-10 px-6">
              <img class="mx-auto" src="/images/error.webp" alt="Error" />
              <h3>No Information Available</h3>
              <p>The point of using Lorem Ipsum is that it has a.</p>
            </div></div>`;
        }

        // Hide preloader after data is fetched
        preloader.classList.add("hidden");
        categoryContainer.classList.remove("hidden");
      })
      .catch((error) => {
        console.error(error);

        // Hide preloader if there's an error
        preloader.classList.add("hidden");
      });
  }, 2000);
  cardContainer.classList.add("grid"); // Simulate a 2-second delay
};

const fetchPetDetails = (petId) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        showModal(data.petData); // Call showModal with the pet details
      } else {
        console.log("Failed to fetch pet details.");
      }
    })
    .catch((error) => console.log(error));
};

const showModal = (pet) => {
  const modal = document.getElementById("petModal");
  const modalContent = document.getElementById("modalContent");

  // Set the modal content with the pet's details
  modalContent.innerHTML = `
    <img class="md:h-[250px] h-[180px] w-full  object-cover md:mb-4 mx-auto rounded-lg" src="${
      pet.image
    }" 
  }
  }" />
    <h2 class="md:text-xl text-lg font-bold">${
      pet.pet_name || "Not Available"
    }</h2>
    <div class="md:flex md:gap-4 ">

    <div>
       <div class="flex items-center  gap-1 text-gray-600">
              <img class="size-4" src="/images/Frame.png" alt="" /><p class=" md:text-base text-xs">Breed: ${
                pet.breed || "Not Available"
              }</p> 
            </div>
            
            <div class="flex items-center gap-1 text-gray-600">
              <img class="size-4 " src="https://img.icons8.com/?size=100&id=11780&format=png&color=000000" alt="" /><p class=" md:text-base text-xs">Gender: ${
                pet.gender || "Not Available"
              }</p> 
            </div>

         <div class="flex  items-center gap-1 text-gray-600"><i class="fa-solid fa-syringe"></i><p class=" md:text-base text-xs"> Vaccinated status: ${
           pet.vaccinated_status || "Not Available"
         }</p>
            </div>   
   
    </div>
<div  >
<div class="flex items-center gap-1 text-gray-600"><i class="fa-regular fa-calendar"></i>
              <p class=" md:text-base text-xs">Birth: ${
                pet.date_of_birth || "Not Available"
              }</p>
            </div>

            


  <div class="flex items-center gap-1 text-gray-600">
              <img class="size-4" src="https://img.icons8.com/?size=100&id=aTrWEDlg4xEW&format=png&color=000000" alt="" /><p class=" md:text-base text-xs">Price: ${
                pet.price || "Not Available"
              }</p> 
            </div>
</div>
    
    </div>
    
    
  <hr/>
    <p class="md:text-xl text-lg font-bold">Details Information</p>
    <p class="mb-2  md:text-base text-xs"> ${
      pet.pet_details || "Not Available"
    }</p>
  `;

  // Show the modal
  modal.classList.remove("hidden");
};

const closeModal = () => {
  const modal = document.getElementById("petModal");
  modal.classList.add("hidden");
};

const adoptPet = (button) => {
  // Disable the button to prevent multiple clicks
  button.disabled = true;
  button.classList.add("text-gray-300", "border-2", "border-gray-300");

  // Show the congratulatory modal
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
  modal.innerHTML = `
    <div class="bg-white text-center md:p-6 p-4 rounded-lg  ">
      <img class="mx-auto w-fit" src="https://img.icons8.com/?size=100&id=113086&format=png&color=000000" alt="gift" />
    <h2 class="md:text-2xl text-xl font-bold">Congrats!</h2>
      <p class="md:text-lg text-sm ">Adoption Process is Start For Your Pet</p>
      <p id="countdown" class="md:text-4xl text-2xl font-bold ">3</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Start the countdown
  let countdown = 3;
  const countdownElement = document.getElementById("countdown");

  const interval = setInterval(() => {
    countdown--;
    countdownElement.innerText = countdown;

    if (countdown <= 0) {
      clearInterval(interval);
      // Close the modal after the countdown
      document.body.removeChild(modal);
    }
  }, 1000);
};

loadCategory();
loadAllPets();

const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1",
});
api.defaults.headers.common["X-API-KEY"] =
  "live_2E7GlPn7PxH8Dtu2wHDn5Bn18HrDPGAOVg5WorXY45nju426FzBpkU1YW39pFcOp";

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2";
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) =>
  `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const spanError = document.getElementById("error");

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log("Random");
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const btn1 = document.getElementById("btn1");
    const btn2 = document.getElementById("btn2");

    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVORITES, {
    method: "GET",
    headers: {
      "X-API-KEY":
        "live_2E7GlPn7PxH8Dtu2wHDn5Bn18HrDPGAOVg5WorXY45nju426FzBpkU1YW39pFcOp",
    },
  });
  const data = await res.json();
  console.log("Favoritos");
  console.log(data);

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    const section = document.getElementById("favoriteMichis");
    section.innerHTML = "";

    const h2 = document.createElement("h2");
    const h2Text = document.createTextNode("Favourites");
    h2.className = "btn-info ";
    h2.appendChild(h2Text);
    section.appendChild(h2);

    data.forEach((michi) => {
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("✖");
      const div = document.createElement("div");

      img.src = michi.image.url;
      img.width = 150;
      img.className = "img-fav ";
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id);
      div.appendChild(img);
      div.appendChild(btn);
      div.className = "col-6 cont-fav";
      section.appendChild(div);
    });

    const btnDelAll = document.createElement("button");
    const btnTextDelAll = document.createTextNode("Delete all");
    btnDelAll.className = "del-btn";
    btnDelAll.appendChild(btnTextDelAll);
    section.appendChild(btnDelAll);

    btnDelAll.onclick = () => {
      data.forEach((michi) => {
        deleteFavouriteMichi(michi.id);
      });
    };
  }
}

async function saveFavouriteMichi(id) {
  const { data, status } = await api.post("/favourites", {
    image_id: id,
  });
  console.log("Save");

  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
    console.log("Michi guardado en favoritos");
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY":
        "live_2E7GlPn7PxH8Dtu2wHDn5Bn18HrDPGAOVg5WorXY45nju426FzBpkU1YW39pFcOp",
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log("Michi eliminado de favoritos");
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);

  console.log(formData.get("file"));

  const res = await fetch(API_URL_UPLOAD, {
    method: "POST",
    headers: {
      "X-API-KEY":
        "live_2E7GlPn7PxH8Dtu2wHDn5Bn18HrDPGAOVg5WorXY45nju426FzBpkU1YW39pFcOp",
    },
    body: formData,
  });
  const data = await res.json();
  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    console.log({ data });
  } else {
    console.log("Foto de michi subida :)");
    console.log({ data });
    console.log(data.url);
    saveFavouriteMichi(data.id);
  }
}

const sectionUpload = document.getElementById("uploadingMichi");
const selectPhotoBtn = document.getElementById("file");
const previewImg = document.getElementById("preview");

selectPhotoBtn.addEventListener("change", () => {
  const archivo = selectPhotoBtn.files;
  console.log(archivo);

  if (archivo) {
    const imgMiniUrl = URL.createObjectURL(archivo[0]);
    previewImg.src = imgMiniUrl;
    previewImg.classList = "img-fav preview-on";
    sectionUpload.appendChild(previewImg);
  }
});

loadRandomMichis();
loadFavouriteMichis();

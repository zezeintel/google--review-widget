document.addEventListener("DOMContentLoaded", function () {
  const reviewsContainer = document.querySelector(".reviews-container");
  const errorMessage = document.getElementById("error-message");

  const pastelColors = ["#e0f7fa", "#fce4ec", "#f3e5f5", "#e8f5e9", "#fff3e0"];
  let colorIndex = 0;
  let reviews = [];
  let currentIndex = 0;

  fetch("/api/reviews")
    .then((res) => {
      if (!res.ok) throw new Error("API failed to load");
      return res.json();
    })
    .then((data) => {
      reviews = data.reviews;
      if (!reviews.length) throw new Error("No reviews found");
      renderReview(currentIndex);
    })
    .catch((err) => {
      console.error("Error loading reviews:", err);
      if (errorMessage) errorMessage.style.display = "block";
    });

  function renderReview(index) {
    reviewsContainer.innerHTML = ""; // Clear existing

    const review = reviews[index];
    const stars = "⭐".repeat(Math.round(review.rating || 0));
    const profileInitial = review.author_name?.charAt(0).toUpperCase() || "?";
    const fullText = review.text || "";
    const shortText = fullText.length > 130 ? fullText.substring(0, 130) + "..." : fullText;

    const card = document.createElement("div");
    card.className = "review-card";
    card.style.backgroundColor = pastelColors[colorIndex];
    colorIndex = (colorIndex + 1) % pastelColors.length;

    const isLong = fullText.length > 130;

    card.innerHTML = `
      <div class="google-logo">
        <img src="picture/new.png" alt="Google Logo" style="width: 24px;">
      </div>
      <div class="review-stars">${stars}</div>
      <p class="review-text" data-full="${fullText}" data-short="${shortText}">
        "${shortText}"
      </p>
      ${
        isLong
          ? `<span class="read-more" style="color:#007bff; cursor:pointer;">Read more</span>`
          : ""
      }
      <a href="${review.author_url}" target="_blank" class="review-author">
        ${
          review.profile_photo_url
            ? `<img src="${review.profile_photo_url}" class="author-img" alt="${review.author_name}" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\'fallback-profile\' data-initial=\'${profileInitial}\'></div>');">`
            : `<div class="fallback-profile" data-initial="${profileInitial}"></div>`
        }
        <span class="author-name">${review.author_name}</span>
      </a>
    `;

    reviewsContainer.appendChild(card);
  }

  // Read more toggle
  reviewsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("read-more")) {
      const reviewText = e.target.previousElementSibling;
      const full = reviewText.dataset.full;
      const short = reviewText.dataset.short;

      const showingShort = reviewText.textContent.includes(short);
      reviewText.textContent = `"${showingShort ? full : short}"`;
      e.target.textContent = showingShort ? "Show less" : "Read more";
    }
  });

  // Navigation (if buttons exist in DOM)
  document.querySelector(".prev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    renderReview(currentIndex);
  });

  document.querySelector(".next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % reviews.length;
    renderReview(currentIndex);
  });
});

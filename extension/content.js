function freeUrl(url) {
  const urlObj = new URL(url)

  urlObj.host = "freedium.cfd";

  return urlObj.href;
}

function createReadFreeButton(isInline = false) {
  const button = document.createElement("button");
  button.className = "free-medium__read-free-button";
  button.textContent = "Read for free";
  
  if (isInline) {
    // Inline button style for member-only sections
    button.style.padding = "8px 16px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.margin = "5px 0";
    button.style.display = "block";
    button.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.2)";
  } else {
    // Fixed position button style
    button.id = "free-medium__button";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.padding = "20px 28px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "48px";
    button.style.fontSize = "18px";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";
    button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  }

  button.addEventListener("click", function () {
    window.location.href = freeUrl(document.URL);
  });

  return button;
}

function addReadFreeButtonsAfterMemberOnly() {
  // Find all buttons with aria-label="Member-only story"
  const memberOnlyButtons = document.querySelectorAll('button[aria-label="Member-only story"]');
  
  memberOnlyButtons.forEach(memberButton => {
    // Skip if the button is not in the DOM anymore
    if (!memberButton.parentNode) {
      return;
    }
    
    // Check if we already added a read-free button after this one
    const nextSibling = memberButton.nextElementSibling;
    if (nextSibling && nextSibling.classList.contains('free-medium__read-free-button')) {
      return; // Already added
    }
    
    // Create and insert the read-free button
    const readFreeButton = createReadFreeButton(true);
    memberButton.parentNode.insertBefore(readFreeButton, memberButton.nextSibling);
  });
}

document.addEventListener("readystatechange", (event) => {
  // Add the fixed position button (existing functionality)
  const fixedButton = createReadFreeButton(false);
  document.body.appendChild(fixedButton);
  
  // Add inline buttons after member-only buttons
  addReadFreeButtonsAfterMemberOnly();
  
  // Watch for dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if any new member-only buttons were added
        addReadFreeButtonsAfterMemberOnly();
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});


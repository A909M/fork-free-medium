/**
 * @jest-environment jsdom
 */

// Import the functions from content.js
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

describe("Member-only button functionality", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it("adds read-free buttons after member-only story buttons", () => {
    // Setup DOM with member-only buttons
    document.body.innerHTML = `
      <div>
        <button aria-label="Member-only story">Subscribe to read</button>
        <p>Some content</p>
        <button aria-label="Member-only story">Upgrade to continue</button>
        <button aria-label="Other label">Other button</button>
      </div>
    `;

    // Run the function
    addReadFreeButtonsAfterMemberOnly();

    // Check that read-free buttons were added
    const readFreeButtons = document.querySelectorAll('.free-medium__read-free-button');
    expect(readFreeButtons).toHaveLength(2);

    // Check that they are positioned correctly after member-only buttons
    const memberOnlyButtons = document.querySelectorAll('button[aria-label="Member-only story"]');
    
    memberOnlyButtons.forEach((memberButton, index) => {
      const nextSibling = memberButton.nextElementSibling;
      expect(nextSibling).toBeTruthy();
      expect(nextSibling.classList.contains('free-medium__read-free-button')).toBe(true);
      expect(nextSibling.textContent).toBe('Read for free');
    });

    // Check that no button was added after the other button
    const otherButton = document.querySelector('button[aria-label="Other label"]');
    const otherButtonNext = otherButton.nextElementSibling;
    expect(otherButtonNext).toBeFalsy();
  });

  it("does not add duplicate buttons", () => {
    // Setup DOM with member-only button
    document.body.innerHTML = `
      <div>
        <button aria-label="Member-only story">Subscribe to read</button>
      </div>
    `;

    // Run the function twice
    addReadFreeButtonsAfterMemberOnly();
    addReadFreeButtonsAfterMemberOnly();

    // Should only have one read-free button
    const readFreeButtons = document.querySelectorAll('.free-medium__read-free-button');
    expect(readFreeButtons).toHaveLength(1);
  });

  it("creates inline buttons with correct styling", () => {
    const inlineButton = createReadFreeButton(true);
    
    expect(inlineButton.className).toBe('free-medium__read-free-button');
    expect(inlineButton.textContent).toBe('Read for free');
    expect(inlineButton.style.padding).toBe('8px 16px');
    expect(inlineButton.style.backgroundColor).toBe('rgb(0, 123, 255)'); // Browser converts #007bff to rgb
    expect(inlineButton.style.display).toBe('block');
  });

  it("creates fixed position buttons with correct styling", () => {
    const fixedButton = createReadFreeButton(false);
    
    expect(fixedButton.id).toBe('free-medium__button');
    expect(fixedButton.textContent).toBe('Read for free');
    expect(fixedButton.style.position).toBe('fixed');
    expect(fixedButton.style.bottom).toBe('20px');
    expect(fixedButton.style.right).toBe('20px');
  });
});
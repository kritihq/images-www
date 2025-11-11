---
title: Transformations (WIP)
---

## Brightness
Brightness transformation shifts all pixel values
equally, making the entire image lighter or darker.
Unlike gamma correction, brightness affects all tones
uniformly.

*  **Range:** -100 to 100
*  **Default:** 0 (no change)
*  **Negative values:** Make image darker
*  **Positive values:** Make image brighter
*  **Extreme values:** -100 = completely black, +100 = completely white

<section class="transformation-section px-4">
<!-- Tabs -->
<div
    class="tab-content flex flex-row gap-8 [&>button]:px-4 [&>button]:py-2 [&>button]:rounded-md [&>button]:cursor-pointer [&>button]:border-0 [&>button]:hover:bg-blue-200 [&>button.active]:text-white [&>button.active]:bg-blue-500"
>
    <button
        class="active"
        onclick="showTab(event, 'brightness-original')"
    >
        Original
    </button>
    <button
        onclick="showTab(event, 'brightness-negative')"
    >
        Brightness -40
    </button>
    <button
        onclick="showTab(event, 'brightness-positive')"
    >
        Brightness +40
    </button>
</div>

<script>
function showTab(evt, tabId) {
  // Hide all tab contents in the same section
  const section = evt.target.closest(".transformation-section");
  const tabContents = section.querySelectorAll(".tab-contents > div");
  const tabs = section.querySelectorAll("button");

  // Remove active class from all tabs and contents
  tabContents.forEach((content) => content.classList.remove("active"));
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabId).classList.add("active");
  evt.target.classList.add("active");
}
</script>

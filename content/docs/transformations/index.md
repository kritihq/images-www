---
title: Transformations (WIP)
---

## Brightness
Brightness transformation shifts all pixel values
equally, making the entire image lighter or darker.
Unlike gamma correction, brightness affects all tones
uniformly.

* **Range:** -100 to 100
* **Default:** 0 (no change)
* **Negative values:** Make image darker
* **Positive values:** Make image brighter
* **Extreme values:** -100 = completely black, +100 = completely white

{{< transformations tabs="brightness-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (brightness=0)|brightness-negative;Brightness -40;/cgi/images/tr:brightness=-40/image1.jpg;Brightness -40;Darkened image - all pixels shifted down by 40 units (brightness=-40)|brightness-positive;Brightness +40;/cgi/images/tr:brightness=40/image1.jpg;Brightness +40;Brightened image - all pixels shifted up by 40 units (brightness=+40)" >}}

## Contrast

Contrast transformation adjusts the difference between light and dark areas, making lights lighter and darks darker (or vice versa). Unlike brightness, contrast affects the tonal range and separation between colors.

- **Range:** -100 to 100
- **Default:** 0 (no change)
- **Negative values:** Reduce contrast, flatten tonal range
- **Positive values:** Increase contrast, expand tonal range
- **Extreme values:** -100 = flat gray, +100 = maximum contrast

{{< transformations tabs="contrast-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (contrast=0)|contrast-negative;Contrast -40;/cgi/images/tr:contrast=-40/image1.jpg;Contrast -40;Reduced contrast - flattened tonal range, more washed out appearance (contrast=-40)|contrast-positive;Contrast +50;/cgi/images/tr:contrast=50/image1.jpg;Contrast +50;Enhanced contrast - expanded tonal range, more dramatic difference between lights and darks (contrast=+50)" >}}


## Flip

Flip transformation mirrors the image along horizontal, vertical, or both axes. This is a lossless transformation that simply reorders pixels without quality loss.

- **h:** Horizontal flip (mirror left-right)
- **v:** Vertical flip (mirror top-bottom)
- **hv or vh:** Both horizontal and vertical flip (180° rotation)
- **Quality:** No quality loss - pixels are only repositioned

{{< transformations tabs="flip-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (no flip)|flip-h;Horizontal Flip;/cgi/images/tr:flip=h/image1.jpg;Horizontal Flip;Horizontally flipped image (flip=h)|flip-v;Vertical Flip;/cgi/images/tr:flip=v/image1.jpg;Vertical Flip;Vertically flipped image (flip=v)" >}}


## Blur

Blur transformation applies Gaussian blur to soften the image by reducing sharp transitions between pixels. This is commonly used for background effects or noise reduction.

- **Range:** 1 to 250
- **Default:** 1 (minimal blur)
- **Low values (1-10):** Subtle softening, noise reduction
- **Medium values (11-50):** Noticeable blur for artistic effects
- **High values (51-250):** Heavy blur for backgrounds or privacy
- **Performance:** Higher values require more processing time

{{< transformations tabs="blur-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (no blur)|blur-light;Light Blur (3);/cgi/images/tr:blur=3/image1.jpg;Light Blur;Subtle blur - good for noise reduction while maintaining detail (blur=3)|blur-medium;Medium Blur (10);/cgi/images/tr:blur=10/image1.jpg;Medium Blur;Moderate blur - good for artistic effects and background softening (blur=10)|blur-heavy;Heavy Blur (25);/cgi/images/tr:blur=25/image1.jpg;Heavy Blur;Heavy blur - ideal for privacy, backgrounds, or strong artistic effects (blur=25)" >}}


## Gamma

Gamma correction applies a non-linear curve that affects midtones more than highlights and shadows. Unlike brightness, gamma preserves pure black and white while adjusting the middle gray values.

- **Range:** 0.1 to 2.0
- **Default:** 1.0 (no change)
- **Values < 1.0 (0.1-0.9):** Brighten midtones, lift shadows
- **Values > 1.0 (1.1-2.0):** Darken midtones, deepen shadows
- **Best for:** Adjusting exposure without clipping highlights/shadows
- **Common values:** 0.5 (brighten), 1.8 (darken)

{{< transformations tabs="gamma-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (gamma=1.0)|gamma-bright;Bright (0.5);/cgi/images/tr:gamma=0.5/image1.jpg;Dark Gamma;Brightened midtones - shadows lifted while preserving highlights (gamma=0.5)|gamma-dark;Dark (1.8);/cgi/images/tr:gamma=1.8/image1.jpg;Gamma 1.8;Darkened midtones - shadows deepened while preserving highlights (gamma=1.8)" >}}


## Rotate

Rotate transformation rotates the image by a specified angle in degrees. Supports both numeric angles and convenient shortcuts for common rotations.

- **Numeric values:** Any angle in degrees (0-360)
- **Shortcuts:** 90/cw/right, 180/flip, 270/-90/ccw/left
- **Quality:** Best results with multiples of 90°
- **Background:** Transparent areas filled automatically
- **Auto-normalize:** Angles automatically adjusted to 0-360° range

{{< transformations tabs="rotate-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (0° rotation)|rotate-90;90° ;/cgi/images/tr:rotate=90/image1.jpg;Rotated 90°;90° clockwise rotation - can also use 'cw' or 'right' as shortcuts|rotate-180;180° ;/cgi/images/tr:rotate=180/image1.jpg;Rotated 180°;180° rotation (upside down) - can also use 'flip' as shortcut|rotate-270;270° ;/cgi/images/tr:rotate=270/image1.jpg;Rotated 270°;270° rotation (counter-clockwise) - can also use 'ccw', '-90', or 'left'|rotate-45;45° ;/cgi/images/tr:rotate=45/image1.jpg;Rotated 45°;45° custom rotation - non-90° multiples may have slight quality reduction" >}}


## Border Radius

Border radius transformation applies rounded corners to images, similar to the CSS border-radius property. Supports both pixel and percentage values for flexible corner rounding.

- **Pixel values:** Fixed radius in pixels (e.g., 10, 20px)
- **Percentage values:** Responsive radius based on image size (e.g., 15%, 25%)
- **Multiple values:** CSS-style syntax for different corners
- **Anti-aliasing:** Smooth edges for professional results
- **Transparency:** Areas outside radius become transparent

{{< transformations tabs="radius-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image with sharp corners|radius-pixel;20px Radius;/cgi/images/tr:br-radius=20/image1.jpg;20px Border Radius;20 pixel border radius applied to all corners|radius-percent;15% Radius;/cgi/images/tr:br-radius=15%/image1.jpg;15% Border Radius;15% border radius - responsive to image dimensions" >}}


## Saturation

Saturation transformation adjusts the intensity and vividness of colors in the image. This affects how vibrant colors appear without changing their hue or brightness.

- **Range:** -100 to 500
- **Default:** 0 (no change)
- **-100:** Complete grayscale (no color)
- **Negative values (-99 to -1):** Reduce color intensity, more muted
- **Positive values (1-100):** Increase color intensity, more vivid
- **High values (101-500):** Hyper-saturated colors for artistic effects

{{< transformations tabs="saturation-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (saturation=0)|saturation-grayscale;Grayscale (-100);/cgi/images/tr:saturation=-100/image1.jpg;Grey Scale;Complete grayscale - all color information removed (saturation=-100)|saturation-enhanced;Enhanced (+60);/cgi/images/tr:saturation=60/image1.jpg;Enhanced Saturation;Enhanced colors - more vibrant and vivid appearance (saturation=+60)|saturation-hyper;Hyper (+150);/cgi/images/tr:saturation=150/image1.jpg;Hyper Saturation;Hyper-saturated colors - extreme vividness for artistic effects (saturation=+150)" >}}


## Sharpen

Sharpen transformation enhances edge definition and image clarity using unsharp masking. This technique increases contrast along edges to make images appear more crisp.

- **Range:** 0.5 to 1.5
- **Default:** 0.5 (minimal sharpening)
- **Low values (0.5-0.8):** Subtle edge enhancement
- **Medium values (0.9-1.2):** Noticeable sharpening for photos
- **High values (1.3-1.5):** Strong sharpening, may introduce artifacts
- **Best for:** Slightly blurry or soft images

{{< transformations tabs="sharpen-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (no sharpening)|sharpen-subtle;Subtle (0.8);/cgi/images/tr:sharpen=0.8/image1.jpg;Subtle Sharpen;Subtle sharpening - gentle edge enhancement without artifacts (sharpen=0.8)|sharpen-strong;Strong (1.3);/cgi/images/tr:sharpen=1.3/image1.jpg;Strong Sharpen;Strong sharpening - dramatic edge enhancement for very soft images (sharpen=1.3)" >}}


## Width

Width transformation resizes the image to a specific width while automatically calculating height to maintain aspect ratio. This is useful for responsive design and consistent layouts.

- **Range:** 1 to 10,000 pixels
- **Aspect ratio:** Automatically preserved
- **Height:** Calculated automatically
- **Common uses:** Responsive images, thumbnails
- **Quality:** Uses high-quality Lanczos resampling

{{< transformations tabs="width-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (original width)|width-300;Width 300px;/cgi/images/tr:width=300/image1.jpg;Width 300px;Resized to 300px width (width=300)|width-150;Width 150px;/cgi/images/tr:width=150/image1.jpg;Width 150px;Resized to 150px width (width=150)" >}}


## Height

Height transformation resizes the image to a specific height while automatically calculating width to maintain aspect ratio. Perfect for vertical layouts and consistent image heights.

- **Range:** 1 to 10,000 pixels
- **Aspect ratio:** Automatically preserved
- **Width:** Calculated automatically
- **Common uses:** Card layouts, galleries
- **Quality:** Uses high-quality Lanczos resampling

{{< transformations tabs="height-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (original height)|height-200;Height 200px;/cgi/images/tr:height=200/image1.jpg;Height 200px;Resized to 200px height (height=200)|height-100;Height 100px;/cgi/images/tr:height=100/image1.jpg;Height 100px;Resized to 100px height (height=100)" >}}


## Background

Background transformation sets a background color for transparent areas, padding operations, or rotation fills. Essential for maintaining visual consistency when transforming images.

- **Hex colors:** #ff0000, #00ff00, #0000ff
- **Named colors:** red, green, blue, white, black
- **RGB format:** rgb(255,0,0)
- **Special:** transparent (default)
- **Use cases:** Padding, rotation fills, PNG transparency

{{< transformations tabs="background-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (transparent background)|background-red;Red Background;/cgi/images/tr:width=700,height=500,background=red/image1.jpg;Red Background;Red background (background=red)|background-blue;Blue Background;/cgi/images/tr:width=700,height=500,background=blue/image1.jpg;Blue Background;Blue background (background=blue)" >}}


## Fit

Fit transformation controls how images are resized to fit specified dimensions. Each mode handles aspect ratio preservation and sizing behavior differently:

- **contain:** Scales image to fit within bounds while preserving aspect ratio (like CSS object-fit: contain)
- **cover:** Scales image to fill entire area while preserving aspect ratio, may crop parts (like CSS object-fit: cover)
- **crop:** Smart crop - scales down if source is smaller than target, otherwise behaves like cover
- **pad:** Scales to fit within bounds, then adds padding with background color to reach exact dimensions
- **squeeze:** Scales to exact dimensions without preserving aspect ratio (may distort image)
- **scaledown:** Like contain, but only scales down - never enlarges images smaller than target dimensions

{{< transformations tabs="fit-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image (no fit transformation)|fit-contain;Contain;/cgi/images/tr:width=400,height=300,fit=contain/image1.jpg;Fit Contain;Scales image to fit completely within 400x300 bounds while preserving aspect ratio. Image may be smaller than target dimensions.|fit-cover;Cover;/cgi/images/tr:width=400,height=300,fit=cover/image1.jpg;Fit Cover;Scales image to completely fill 400x300 area while preserving aspect ratio. Parts of image may be cropped.|fit-crop;Crop;/cgi/images/tr:width=400,height=300,fit=crop/image1.jpg;Fit Crop;Smart crop: if source is smaller than 400x300, scales down proportionally; otherwise behaves like cover mode.|fit-pad;Pad;/cgi/images/tr:width=400,height=300,background=blue,fit=pad/image1.jpg;Fit Pad;Scales to fit within bounds, then pads with background color to reach exact 400x300 dimensions.|fit-squeeze;Squeeze;/cgi/images/tr:width=400,height=200,fit=squeeze/image1.jpg;Fit Squeeze;Forces image to exact 400x200 dimensions without preserving aspect ratio. May cause distortion.|fit-scaledown;Scale Down;/cgi/images/tr:width=300,height=600,fit=scaledown/image1.jpg;Fit Scale Down;Like contain, but only scales DOWN. If original is smaller than 800x600, keeps original size unchanged." >}}


## Format

Format transformation converts images between different file formats. This allows you to change the output format of your processed image to optimize for different use cases.

- **jpeg/jpg:** Best for photographs with many colors. Smaller file sizes but lossy compression. Good web performance.
- **png:** Best for images with transparency, screenshots, or graphics with few colors. Lossless compression but larger files.
- **webp:** Modern format with excellent compression. Smaller than JPEG with better quality. Supports transparency like PNG.

{{< transformations tabs="format-jpeg;JPEG;/cgi/images/tr:format=jpeg/image1.jpg;Format JPEG;Convert image to JPEG format with optimized compression for web use.|format-png;PNG;/cgi/images/tr:format=png/image1.jpg;Format PNG;Convert image to PNG format with lossless compression and transparency support.|format-webp;WebP;/cgi/images/tr:format=webp/image1.jpg;Format WEBP;Convert image to WEBP format." >}}



## Quality

For Lossy compressions i.e. JPEG & WebP, use this transformation which suggest the quality of image returned after encoding to the given [format](#tr-format). Values must be between, 1 (lower quality) to 100 (higher quality, lossless for webp), both inclusive.

{{< transformations tabs="quality-original;Original;/cgi/images/tr:quality=100/image1.jpg;Original Image;Original image|quality-1;Quality = 1;/cgi/images/tr:quality=1/image1.jpg;Quality 1%;Quality = 1%|quality-75;Quality = 75;/cgi/images/tr:quality=75/image1.jpg;Quality 75%;Quality = 75%" >}}


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

# Fonts for PDF Generation

## Required Font Files

For Thai language support in PDF generation, please download and place the following font file in this directory:

### NotoSansThai.ttf

- **Download Link**: [Google Fonts - Noto Sans Thai](https://fonts.google.com/noto/specimen/Noto+Sans+Thai)
- **File Name**: `NotoSansThai.ttf`
- **Usage**: Thai language text in PDF invoices

## Installation Steps

1. Visit the Google Fonts link above
2. Click "Download family" to get the font files
3. Extract the zip file
4. Copy `NotoSansThai.ttf` to this folder (`/public/Fonts/`)
5. The PDF generation will automatically use this font for Thai text

## Alternative Download

You can also download directly from:

```
https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4enSKxXhkNA.ttf
```

Save this file as `NotoSansThai.ttf` in this directory.

## Verification

After placing the font file, the directory structure should look like:

```
public/
  Fonts/
    NotoSansThai.ttf  ← Font file should be here
    README.md         ← This file
```

The PDF generation system will automatically detect and use this font for Thai language support.

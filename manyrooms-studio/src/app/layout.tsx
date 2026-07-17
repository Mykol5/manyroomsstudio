// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'ManyRooms - Creative Spaces',
  description: 'Book creative spaces for your next shoot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ============ YOUR EXISTING FONTS ============ */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ============ PIXORA ADDITIONAL FONTS ============ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Besley:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Satisfy:wght@400&family=Teko:wght@300;400;500;600;700&family=Phudu:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Onest:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />

        {/* ============ PIXORA THEME CSS ============ */}
        <link rel="stylesheet" href="/css/themes/pixora/assets/bootstrap8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/font-awesome-pro8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/swiper-bundle8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/magnific-popup8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/spacing8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/nice-select8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-unit8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-core8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-custom-mediaquery8daf.css" />
        <link rel="stylesheet" href="/css/themes/pixora/style8daf.css" />
        
        {/* ============ PLUGIN CSS ============ */}
        <link rel="stylesheet" href="/css/plugins/pixora-core/assets/css/tp-core8a54.css" />
        <link rel="stylesheet" href="/css/plugins/contact-form-7/includes/css/stylesc098.css" />
        
        {/* ============ ELEMENTOR CSS ============ */}
        <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/eicons/css/elementor-icons.min5c93.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-heading.mineda1.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-image.mineda1.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-counter.mineda1.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-divider.mineda1.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min52d5.css" />
        <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/font-awesome/css/brands.min52d5.css" />
        
        {/* ============ PIXORA ELEMENTOR WIDGET CSS ============ */}
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/hero/herof488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/banner/bannerf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/services/services-all/servicesf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/portfolio/portfoliof488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/interactive/interactivef488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/slider/text-slider/text-sliderf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/award/awardf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/contact/contactf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/creative_agency/instagramf488.css" />
        <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/feature/featuref488.css" />
        
        {/* ============ ELEMENTOR PAGE CSS ============ */}
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/custom-frontend.min725a.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-7032bcb3.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16393033e.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16883033e.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16138b2de.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-13226b2de.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16555033e.css" />
        
        {/* ============ ELEMENTOR GOOGLE FONTS ============ */}
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/google-fonts/css/roboto9f8a.css" />
        <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/google-fonts/css/robotoslabbd51.css" />
        
        {/* Favicon */}
        <link rel="icon" href="/images/pixora/favicon-1.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/pixora/favicon-1.png" />
      </head>
      <body className="tp-magic-cursor no-sidebar" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        
        {/* ============ JQUERY (MUST LOAD FIRST) ============ */}
        <script src="/js/includes/jquery/jquery.minf43b.js"></script>
        <script src="/js/includes/jquery/jquery-migrate.min5589.js"></script>
        
        {/* ============ WORDPRESS CORE JS ============ */}
        <script src="/js/includes/imagesloaded.minbb93.js"></script>
        
        {/* ============ PIXORA THEME JS ============ */}
        <script src="/js/themes/pixora/assets/bootstrap-bundle8daf.js"></script>
        <script src="/js/themes/pixora/assets/plugin8daf.js"></script>
        <script src="/js/themes/pixora/assets/magnific-popup8daf.js"></script>
        <script src="/js/themes/pixora/assets/nice-select8daf.js"></script>
        <script src="/js/themes/pixora/assets/tp-cursor8daf.js"></script>
        <script src="/js/themes/pixora/assets/swiper-bundle8daf.js"></script>
        <script src="/js/themes/pixora/assets/split-type8daf.js"></script>
        <script src="/js/themes/pixora/assets/ripple8daf.js"></script>
        <script src="/js/themes/pixora/assets/main8daf.js"></script>
        <script src="/js/themes/pixora/assets/main-px8daf.js"></script>
        <script src="/js/themes/pixora/assets/slider-active8daf.js"></script>
        <script src="/js/themes/pixora/assets/slider-active-px8daf.js"></script>
        
        {/* ============ PLUGIN JS ============ */}
        <script src="/js/plugins/pixora-core/assets/js/hello-worldf488.js"></script>
      </body>
    </html>
  )
}



// // app/layout.tsx
// import type { Metadata } from 'next'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'ManyRooms - Creative Spaces',
//   description: 'Book creative spaces for your next shoot',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className="dark">
//       <head>
//         {/* ============ YOUR EXISTING FONTS ============ */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100;200;300;400;500;600;700&display=swap"
//           rel="stylesheet"
//         />

//         {/* ============ PIXORA ADDITIONAL FONTS ============ */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link 
//           href="https://fonts.googleapis.com/css2?family=Besley:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Satisfy:wght@400&family=Teko:wght@300;400;500;600;700&family=Phudu:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Onest:wght@300;400;500;600;700;800&display=swap" 
//           rel="stylesheet" 
//         />

//         {/* ============ PIXORA THEME CSS ============ */}
//         <link rel="stylesheet" href="/css/themes/pixora/assets/bootstrap8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/font-awesome-pro8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/swiper-bundle8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/magnific-popup8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/spacing8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/nice-select8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-unit8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-core8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-custom-mediaquery8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/style8daf.css" />
        
//         {/* ============ PLUGIN CSS ============ */}
//         <link rel="stylesheet" href="/css/plugins/pixora-core/assets/css/tp-core8a54.css" />
//         <link rel="stylesheet" href="/css/plugins/contact-form-7/includes/css/stylesc098.css" />
        
//         {/* ============ ELEMENTOR CSS ============ */}
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/eicons/css/elementor-icons.min5c93.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-heading.mineda1.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-image.mineda1.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-counter.mineda1.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/css/widget-divider.mineda1.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min52d5.css" />
//         <link rel="stylesheet" href="/css/plugins/elementor/assets/lib/font-awesome/css/brands.min52d5.css" />
        
//         {/* ============ PIXORA ELEMENTOR WIDGET CSS ============ */}
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/hero/herof488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/banner/bannerf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/services/services-all/servicesf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/portfolio/portfoliof488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/interactive/interactivef488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/slider/text-slider/text-sliderf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/award/awardf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/contact/contactf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/creative_agency/instagramf488.css" />
//         <link rel="stylesheet" href="/css/plugins/pixora-core/include/elementor/common/feature/featuref488.css" />
        
//         {/* ============ ELEMENTOR PAGE CSS ============ */}
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/custom-frontend.min725a.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-7032bcb3.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16393033e.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16883033e.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16138b2de.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-13226b2de.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16555033e.css" />
        
//         {/* ============ ELEMENTOR GOOGLE FONTS ============ */}
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/google-fonts/css/roboto9f8a.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/google-fonts/css/robotoslabbd51.css" />
        
//         {/* Favicon */}
//         <link rel="icon" href="/images/pixora/favicon-1.png" sizes="32x32" />
//         <link rel="apple-touch-icon" href="/images/pixora/favicon-1.png" />
//       </head>
//       {/* <body className="bg-background-dark text-slate-100"> */}
//       {/* <body className="tp-magic-cursor no-sidebar elementor-default elementor-template-full-width elementor-kit-7032 elementor-page elementor-page-16393"> */}
//       <body className="bg-background-light text-slate-100">
//         <AuthProvider>{children}</AuthProvider>
        
//         {/* ============ JQUERY (MUST LOAD FIRST) ============ */}
//         <script src="/js/includes/jquery/jquery.minf43b.js"></script>
//         <script src="/js/includes/jquery/jquery-migrate.min5589.js"></script>
        
//         {/* ============ WORDPRESS CORE JS ============ */}
//         <script src="/js/includes/imagesloaded.minbb93.js"></script>
//         <script src="/js/includes/dist/hooks.min394d.js"></script>
//         <script src="/js/includes/dist/i18n.mineca5.js"></script>
        
//         {/* ============ PIXORA THEME JS ============ */}
//         <script src="/js/themes/pixora/assets/bootstrap-bundle8daf.js"></script>
//         <script src="/js/themes/pixora/assets/plugin8daf.js"></script>
//         <script src="/js/themes/pixora/assets/magnific-popup8daf.js"></script>
//         <script src="/js/themes/pixora/assets/nice-select8daf.js"></script>
//         <script src="/js/themes/pixora/assets/tp-cursor8daf.js"></script>
//         <script src="/js/themes/pixora/assets/swiper-bundle8daf.js"></script>
//         <script src="/js/themes/pixora/assets/split-type8daf.js"></script>
//         <script src="/js/themes/pixora/assets/ripple8daf.js"></script>
//         <script src="/js/themes/pixora/assets/main8daf.js"></script>
//         <script src="/js/themes/pixora/assets/main-px8daf.js"></script>
//         <script src="/js/themes/pixora/assets/slider-active8daf.js"></script>
//         <script src="/js/themes/pixora/assets/slider-active-px8daf.js"></script>
//         <script src="/js/themes/pixora/assets/distortion-img8717.js" type="module"></script>
//         <script src="/js/themes/pixora/assets/portfolio-slider-18717.js" type="module"></script>
//         <script src="/js/themes/pixora/assets/img-revel/index8717.js" type="module"></script>
//         <script src="/js/themes/pixora/assets/skew-slider/index8717.js" type="module"></script>
        
//         {/* ============ PLUGIN JS ============ */}
//         <script src="/js/plugins/pixora-core/assets/js/hello-worldf488.js"></script>
//         <script src="/js/plugins/contact-form-7/includes/swv/js/indexc098.js"></script>
//         <script src="/js/plugins/contact-form-7/includes/js/indexc098.js"></script>
        
//         {/* ============ ELEMENTOR JS ============ */}
//         <script src="/js/plugins/elementor/assets/js/webpack.runtime.mineda1.js"></script>
//         <script src="/js/plugins/elementor/assets/js/frontend-modules.mineda1.js"></script>
//         <script src="/js/plugins/elementor/assets/js/frontend.mineda1.js"></script>
//         <script src="/js/plugins/elementor/assets/lib/jquery-numerator/jquery-numerator.min3958.js"></script>
        
//         {/* ============ JQUERY UI ============ */}
//         <script src="/js/includes/jquery/ui/core.minb37e.js"></script>
//       </body>
//     </html>
//   )
// }



// // app/layout.tsx
// import type { Metadata } from 'next'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'ManyRooms - Creative Spaces',
//   description: 'Book creative spaces for your next shoot',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className="dark">
//       <head>
//         {/* ============ YOUR EXISTING FONTS ============ */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100;200;300;400;500;600;700&display=swap"
//           rel="stylesheet"
//         />

//         {/* ============ PIXORA ADDITIONAL FONTS ============ */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         <link 
//           href="https://fonts.googleapis.com/css2?family=Besley:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Satisfy:wght@400&family=Teko:wght@300;400;500;600;700&family=Phudu:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Onest:wght@300;400;500;600;700;800&display=swap" 
//           rel="stylesheet" 
//         />

//         {/* ============ PIXORA THEME CSS ============ */}
//         <link rel="stylesheet" href="/css/themes/pixora/assets/bootstrap8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/font-awesome-pro8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/swiper-bundle8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/magnific-popup8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/spacing8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/nice-select8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-unit8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-core8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/assets/pixora-custom-mediaquery8daf.css" />
//         <link rel="stylesheet" href="/css/themes/pixora/style8daf.css" />
        
//         {/* ============ PLUGIN CSS ============ */}
//         <link rel="stylesheet" href="/css/plugins/pixora-core/assets/css/tp-core8a54.css" />
//         <link rel="stylesheet" href="/css/plugins/contact-form-7/includes/css/stylesc098.css" />
        
//         {/* ============ ELEMENTOR PAGE CSS ============ */}
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-7032bcb3.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16393033e.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16883033e.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16138b2be.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-13226b2be.css" />
//         <link rel="stylesheet" href="/css/uploads/sites/27/elementor/css/post-16555033e.css" />
        
//         {/* Favicon */}
//         <link rel="icon" href="/images/pixora/favicon-1.png" sizes="32x32" />
//         <link rel="apple-touch-icon" href="/images/pixora/favicon-1.png" />
//       </head>
//       <body className="bg-background-dark text-slate-100">
//         <AuthProvider>{children}</AuthProvider>
        
//         {/* ============ JQUERY (MUST LOAD FIRST) ============ */}
//         <script src="/js/includes/jquery/jquery.minf43b.js"></script>
        
//         {/* ============ WORDPRESS CORE JS ============ */}
//         <script src="/js/includes/imagesloaded.minbb93.js"></script>
        
//         {/* ============ PIXORA THEME JS ============ */}
//         <script src="/js/themes/pixora/assets/bootstrap-bundle8daf.js"></script>
//         <script src="/js/themes/pixora/assets/plugin8daf.js"></script>
//         <script src="/js/themes/pixora/assets/magnific-popup8daf.js"></script>
//         <script src="/js/themes/pixora/assets/nice-select8daf.js"></script>
//         <script src="/js/themes/pixora/assets/tp-cursor8daf.js"></script>
//         <script src="/js/themes/pixora/assets/swiper-bundle8daf.js"></script>
//         <script src="/js/themes/pixora/assets/split-type8daf.js"></script>
//         <script src="/js/themes/pixora/assets/ripple8daf.js"></script>
//         <script src="/js/themes/pixora/assets/main8daf.js"></script>
//         <script src="/js/themes/pixora/assets/main-px8daf.js"></script>
//         <script src="/js/themes/pixora/assets/slider-active8daf.js"></script>
//         <script src="/js/themes/pixora/assets/slider-active-px8daf.js"></script>
        
//         {/* ============ PLUGIN JS ============ */}
//         <script src="/js/plugins/pixora-core/assets/js/hello-worldf488.js"></script>
//       </body>
//     </html>
//   )
// }





// import type { Metadata } from 'next'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'Login | ManyRooms Studios',
//   description: 'Access the ManyRooms Studio Management Platform',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className="dark">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
//           rel="stylesheet"
//         />
//         {/* Playfair Display for the new home page */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
//           rel="stylesheet"
//         />
//         {/* Material Icons */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100;200;300;400;500;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-background-dark text-slate-100">
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   )
// }



// import type { Metadata } from 'next'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'Login | ManyRooms Studios',
//   description: 'Access the ManyRooms Studio Management Platform',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className="dark">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
//           rel="stylesheet"
//         />
//         {/* Add Material Icons - THIS WAS MISSING */}
//         <link
//           href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100;200;300;400;500;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-background-dark text-slate-100">
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   )
// }




// import type { Metadata } from 'next'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'

// export const metadata: Metadata = {
//   title: 'Login | ManyRooms Studios',
//   description: 'Access the ManyRooms Studio Management Platform',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className="dark">
//       <head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
//           rel="stylesheet"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
//           rel="stylesheet"
//         />
//       </head>
//       <body className="bg-background-dark text-slate-100">
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   )
// }





// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

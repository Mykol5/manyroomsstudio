
// app/HomePageClient.tsx
'use client';

export default function HomePageClient() {
  return (
    <>
      {/* Begin magic cursor */}
      <div id="magic-cursor" className="cursor-white-bg">
        <div id="ball" data-text-color="#000"
          style={{ backgroundColor: '#000' }}
          data-small-cursor="#000"
          data-big-cursor="#fff"></div>
      </div>

      {/* preloader */}
      <div id="loader" className="loader">
        <div className="loader__wrapper">
          <div className="loader__content">
            <div className="loader__count">
              <span className="count__text">0</span>
              <span className="count__percent">%</span>
            </div>
          </div>
          <span className="count__bdr"></span>
        </div>
      </div>

      <div className="back-to-top-wrapper">
        <button id="back_to_top" type="button" className="back-to-top-btn">
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="px-blur-bottom"></div>

      {/* header */}
      <div data-elementor-type="wp-post" data-elementor-id="16883" className="elementor elementor-16883">
        <div className="elementor-element elementor-element-6f9b317 e-flex e-con-boxed e-con e-parent" data-id="6f9b317" data-element_type="container" data-e-type="container">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-d911cd3 elementor-widget elementor-widget-tp-px-header-01" data-id="d911cd3" data-element_type="widget" data-e-type="widget" data-widget_type="tp-px-header-01.default">
              <div className="elementor-widget-container">
                <div className="tp-header-creative">
                  <header>
                    <div className="px-header-area header-transparent px-header-ptb px-header-style-black">
                      <div className="row align-items-center">
                        <div className="col-lg-4 col-md-3 col-6">
                          <div className="px-header-logo tp-el-logo">
                            <a href="/">
                              <img data-width="90" src="/wp-content/uploads/sites/27/2025/10/logo-orange.png" alt="ManyRooms" />
                            </a>
                          </div>
                        </div>
                        <div className="col-lg-8 col-md-9 col-6">
                          <div className="px-header-box d-flex justify-content-end align-items-center">
                            <div className="px-header-menu tp-header-dropdown dropdown-white-bg d-none d-xl-block">
                              <nav className="tp-mobile-menu-active">
                                <ul id="menu-1-d911cd3" className="tp-nav-menu">
                                  <li className="menu-item nav-item">
                                    <a title="Home" href="/" className="nav-links">Home</a>
                                  </li>
                                  <li className="menu-item nav-item">
                                    <a title="Spaces" href="/spaces" className="nav-links">Spaces</a>
                                  </li>
                                  <li className="menu-item nav-item">
                                    <a title="Blog" href="/blog" className="nav-links">Blog</a>
                                  </li>
                                  <li className="menu-item nav-item">
                                    <a title="Contact" href="/contact" className="nav-links">Contact</a>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                            <div className="px-header-action tp-el-block">
                              <button className="px-header-bar tp-offcanvas-open-btn">
                                <span></span>
                                <span></span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>
                </div>

                <div className="tp-offcanvas-area px-offcanvas-style">
                  <div className="tp-offcanvas-wrapper default">
                    <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
                      <div className="tp-offcanvas-logo tp-el-offcanvas-logo">
                        <a href="/">
                          <img src="/wp-content/uploads/sites/27/2025/10/logo-orange.png" alt="ManyRooms" />
                        </a>
                      </div>
                      <div className="tp-offcanvas-close">
                        <button className="tp-offcanvas-close-btn">
                          <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="tp-offcanvas-main">
                      <div className="tp-main-menu-mobile tp-offcanvas-menu d-xl-none">
                        <nav></nav>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="body-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          {/* HERO */}
          <div className="bf-hero-area bf-hero-3-spacing bf-hero-anime-area tp-el-section">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="bf-hero-3-wrap">
                    <h2 className="bf-hero-3-title tp-el-title">
                      <span className="bf-item-anime-md marque d-inline-block">Craft</span>
                      <span className="bf-item-anime marque d-inline-block">CREATIVE</span>
                      <span className="bf-item-anime-md marque d-inline-block">experiences</span>
                      <span className="bf-item-anime marque d-inline-block">that</span>
                      <span className="bf-item-anime-md marque d-inline-block">Shape</span>
                      <span className="bf-item-anime marque d-inline-block">TOMMOROW.</span>
                    </h2>
                  </div>
                </div>
                <div className="col-lg-6 col-md-3">
                  <div className="bf-rounded-btn-wrap text-md-end mt-50 mr-185 mb-30">
                    <a href="/spaces" className="bf-btn-rounded btn-item tp-el-btn">
                      Discover<br /> Work
                      <i className="bf-btn-circle-dot"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 col-md-9">
                  <div className="bf-hero-3-dec mb-30">
                    <p className="tp-el-desc">
                      ManyRooms connects photographers, filmmakers, and brands<br /> with production-ready spaces across the city.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Video */}
          <div className="bf-hero-3-video-wrap tp-el-section tp-el-video">
            <video loop muted autoPlay playsInline>
              <source src="/videos/hero-bg-video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* ABOUT */}
          <section style={{ padding: '5rem 0' }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-4">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(15,23,42,0.4)' }}>About us</span>
                </div>
                <div className="col-lg-8">
                  <h2 className="tp-section-tittle mb-50 tp-el-title reveal-text" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2 }}>
                    An independent studio marketplace built in London — we vet every space, support every shoot, and help creators book with confidence.
                  </h2>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-lg-3">
                  <img src="/wp-content/uploads/sites/27/2025/11/thumb-4-1.jpg" alt="" style={{ borderRadius: '16px', width: '100%' }} />
                </div>
                <div className="col-lg-4">
                  <img src="/wp-content/uploads/sites/27/2025/11/thumb-2-1.jpg" alt="" style={{ borderRadius: '16px', width: '100%' }} />
                </div>
                <div className="col-lg-5">
                  <img src="/wp-content/uploads/sites/27/2025/11/avatar.png" alt="" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: 'rgba(15,23,42,0.55)', marginBottom: '2rem' }}>Driven by a passion for innovation, we specialize in delivering top-quality spaces for your creative shoots</p>
                  <div className="row">
                    <div className="col-6">
                      <div className="elementor-counter">
                        <div className="elementor-counter-number-wrapper">
                          <span className="elementor-counter-number" data-duration="2000" data-to-value="98">0</span>
                          <span className="elementor-counter-number-suffix">%</span>
                        </div>
                        <div className="elementor-counter-title">Clients Satisfied and Repeating</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="elementor-counter">
                        <div className="elementor-counter-number-wrapper">
                          <span className="elementor-counter-number" data-duration="2000" data-to-value="2500">0</span>
                          <span className="elementor-counter-number-suffix">+</span>
                        </div>
                        <div className="elementor-counter-title">Shoots Booked Across the Network</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section style={{ padding: '5rem 0', background: '#f8f9fb' }}>
            <div className="container">
              <div className="row mb-5">
                <div className="col-lg-4">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(15,23,42,0.4)' }}>OUR SERVICES</span>
                </div>
                <div className="col-lg-8">
                  <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 0.95 }}>Service we&apos;re<br />always provides</h2>
                  <p style={{ color: 'rgba(15,23,42,0.5)', maxWidth: '400px' }}>ManyRooms power of our 8+ years of experience. We build excellence works.</p>
                </div>
              </div>

              {['Development', 'Marketing', 'Graphics', 'Technology'].map((title, i) => (
                <div key={i} className="bf-service-item-3 fix" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0' }}>
                  <div className="row gx-0 align-items-center">
                    <div className="col-lg-6">
                      <div className="bf-service-item-3-wrap d-flex align-items-center" style={{ gap: '1.5rem' }}>
                        <div className="bf-service-item-3-thumb" style={{ width: 60, height: 60, borderRadius: 14, overflow: 'hidden' }}>
                          <img src={`/wp-content/uploads/sites/27/2025/11/st-service-${i + 1}.jpg`} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h4 className="bf-service-item-3-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800 }}>{title}</h4>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="bf-service-item-3-wrapper p-relative fix d-flex align-items-center" style={{ gap: '1rem', overflow: 'hidden' }}>
                        <div className="bf-service-item-3-btn" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="bf-service-item-3-slider" style={{ overflow: 'hidden', flex: 1 }}>
                          <div className="bf-service-item-3-tags" style={{ display: 'flex', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                            {['UX Design', 'User Testing', 'Product Prototype', 'Mobile UI', 'Web app design', 'UX Design', 'User Testing', 'Product Prototype', 'Mobile UI', 'Web app design'].map((tag, ti) => (
                              <span key={ti} style={{ padding: '0.35rem 0.75rem', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, color: 'rgba(15,23,42,0.5)' }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PORTFOLIO */}
          <section style={{ padding: '5rem 0' }}>
            <div className="container">
              <div className="row mb-5 align-items-end">
                <div className="col-lg-8">
                  <h4 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800 }}>
                    <span style={{ display: 'block', textAlign: 'right' }}>recent</span>
                    <span style={{ display: 'block' }}>work</span>
                  </h4>
                  <p style={{ color: 'rgba(15,23,42,0.45)' }}>In the creative wilderness,<br />our work becomes the beacon<br />clients grow to love.</p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <a href="/spaces" className="tp-btn-yellow-green green-solid btn-60" style={{ display: 'inline-flex', padding: '0.75rem 2rem', background: '#0f172a', color: '#fff', borderRadius: 9999, textDecoration: 'none', fontWeight: 600 }}>
                    Explore Work
                  </a>
                </div>
              </div>

              {[
                { title: 'Skillvison', cat: 'Research, UX, UI Design', img: '/wp-content/uploads/sites/27/2025/11/portfolio-1.jpg' },
                { title: 'Kashtech', cat: 'Research, UX, UI Design', img: '/wp-content/uploads/sites/27/2025/11/portfolio-2-1.jpg' },
                { title: 'Rebrand', cat: 'Research, UX, UI Design', img: '/wp-content/uploads/sites/27/2025/11/portfolio-3-1.jpg' },
              ].map((item, i) => (
                <div key={i} className="bf-portfolio-3-item mb-80" style={{ marginBottom: '4rem' }}>
                  <div className="row align-items-center">
                    <div className={`col-xl-5 ${i % 2 === 1 ? '' : 'order-xl-0 order-1'}`}>
                      <div className="bf-portfolio-3-content tp-el-content">
                        <h4 className="bf-portfolio-3-title tp-el-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800 }}>{item.title}</h4>
                        <span style={{ color: 'rgba(15,23,42,0.45)', display: 'block', margin: '0.5rem 0 1rem' }}>{item.cat}</span>
                        <a href="#" className="bf-btn bf-btn-border bf-btn-xl d-inline-flex align-items-center" style={{ padding: '0.6rem 1.5rem', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: 9999, textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.8rem' }}>
                          View project
                        </a>
                      </div>
                    </div>
                    <div className={`col-xl-7 ${i % 2 === 1 ? '' : 'order-xl-1 order-0'}`}>
                      <div style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <img src={item.img} alt={item.title} style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TEXT SLIDER */}
          <div style={{ padding: '2rem 0', background: '#0f172a', overflow: 'hidden' }}>
            <div style={{ display: 'flex', marginBottom: '0.5rem', whiteSpace: 'nowrap', gap: '2rem' }}>
              {[...Array(6)].map((_, i) => (
                <span key={i} style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, color: '#F1CB81', textTransform: 'uppercase' }}>Award & recognitions •</span>
              ))}
            </div>
            <div style={{ display: 'flex', whiteSpace: 'nowrap', gap: '2rem', direction: 'rtl' }}>
              {[...Array(6)].map((_, i) => (
                <span key={i} style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, color: '#F1CB81', textTransform: 'uppercase' }}>Award & recognitions •</span>
              ))}
            </div>
          </div>

          {/* AWARDS */}
          <section style={{ padding: '4rem 0', background: '#0f172a', color: '#fff' }}>
            <div className="container">
              {[
                { title: "A' Design Awards & competition", result: 'Silver Medal' },
                { title: 'AWWWARDS', result: '2X - Honorable' },
                { title: 'CSS Design Awards', result: '2X - Website of the day' },
                { title: 'FWA', result: '2X - Website of the day' },
                { title: 'CSS Reels', result: 'Featured of the day' },
                { title: 'Web Gurus', result: '2X - Guru of the day' },
              ].map((award, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{award.title}</h4>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{award.result}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section style={{ padding: '5rem 0', background: '#0f172a', color: '#fff' }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>ManyRooms@</span>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0 2rem' }}>Leave a reply</h3>
                  <form>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Name *</label>
                      <input type="text" style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Email *</label>
                      <input type="email" style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.5rem' }}>Message *</label>
                      <textarea rows={4} style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }}></textarea>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: '#fff', color: '#0f172a', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                      Send Message
                    </button>
                  </form>
                </div>
                <div className="col-lg-6">
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800 }}>Let&apos;s talk</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Tell us about your project</span> —whether it&apos;s a website, SEO, or marketing.
                  </p>
                  <div className="row mt-4">
                    <div className="col-6">
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Quick response</h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>If you&apos;re ready to create & collaborate, we&apos;d love to hear from you.</p>
                    </div>
                    <div className="col-6">
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Clear next steps</h3>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>If you&apos;re ready to create & collaborate, we&apos;d love to hear from you.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'flex-start' }}>
                    <img src="/wp-content/uploads/sites/27/2025/11/thumb-3.jpg" alt="" style={{ width: 80, height: 90, borderRadius: 12, objectFit: 'cover' }} />
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Team lead</span><br />
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>at ManyRooms</span><br />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Parvej Hossain</span><br />
                      <a href="/contact" style={{ display: 'inline-flex', padding: '0.5rem 1.5rem', background: '#F1CB81', color: '#0f172a', borderRadius: 9999, textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        Let&apos;s Talk
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* INSTAGRAM */}
          <section style={{ padding: 0, background: '#0f172a', position: 'relative' }}>
            <div className="row g-0" style={{ margin: 0 }}>
              {['insta-inner-1.jpg', 'insta-inner-2.jpg', 'insta-inner-3.jpg', 'insta-inner-4.jpg', 'insta-inner-5.jpg', 'insta-inner-6.jpg', 'insta-inner-7.jpg'].map((img, i) => (
                <div key={i} className="col" style={{ flex: '0 0 auto', width: '12.5%' }}>
                  <img src={`/wp-content/uploads/sites/27/2025/11/${img}`} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                </div>
              ))}
              <div className="col" style={{ flex: '0 0 auto', width: '12.5%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FF6B6B' }}>
                <span style={{ fontSize: '2rem', color: '#fff' }}>📸</span>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)', padding: '2rem 3rem', borderRadius: 20, textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>INSTAGRAM</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0' }}>@ManyRooms</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Become a part of our stories!<br />Join the adventure.</p>
              <a href="#" style={{ display: 'inline-flex', padding: '0.6rem 1.8rem', background: '#fff', color: '#0f172a', borderRadius: 9999, textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem' }}>
                Follow Us
              </a>
            </div>
          </section>

          {/* FOOTER */}
          <footer style={{ padding: '4rem 0 2rem', background: '#0f172a', color: '#fff' }}>
            <div className="container">
              <div className="row" style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="col-lg-6">
                  <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700 }}>
                    Let&apos;s create <span style={{ color: 'rgba(255,255,255,0.65)' }}>something</span> together special
                  </p>
                </div>
                <div className="col-lg-6" style={{ textAlign: 'right' }}>
                  {['I', 'D', 'B', 'Y'].map((letter, i) => (
                    <a key={i} href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginLeft: '0.5rem' }}>{letter}</a>
                  ))}
                </div>
              </div>
              <div className="row" style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="col-lg-4">
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>London</h3>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Germany 785 15h Street<br />Office 478 Berlin</a>
                </div>
                <div className="col-lg-4">
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Contact</h3>
                  <a href="tel:+999236542654" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'block' }}>+999 23654 2654</a>
                  <a href="mailto:manyrooms@help.com" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>manyrooms@help.com</a>
                </div>
                <div className="col-lg-4">
                  <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                    <input type="email" placeholder="Enter your email" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', outline: 'none', padding: '0.5rem 0' }} />
                    <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>© 2026 <strong>ManyRooms</strong>. All rights reserved.</p>
                </div>
                <div className="col-6" style={{ textAlign: 'right' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none' }}>Scroll to top</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}


// // app/HomePageClient.tsx
// 'use client';

// export default function HomePageClient() {
//   return (
//     <>
//       {/* Begin magic cursor */}
//       <div id="magic-cursor" className="cursor-white-bg">
//         <div id="ball" data-text-color="#000"
//           style={{ backgroundColor: '#000' }}
//           data-small-cursor="#000"
//           data-big-cursor="#fff"></div>
//       </div>
//       {/* End magic cursor */}

//       {/* preloader */}
//       <div id="loader" className="loader">
//         <div className="loader__wrapper">
//           <div className="loader__content">
//             <div className="loader__count">
//               <span className="count__text">0</span>
//               <span className="count__percent">%</span>
//             </div>
//           </div>
//           <span className="count__bdr"></span>
//         </div>
//       </div>

//       <div className="back-to-top-wrapper">
//         <button id="back_to_top" type="button" className="back-to-top-btn">
//           <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
//               strokeLinejoin="round" />
//           </svg>
//         </button>
//       </div>
//       <div className="px-blur-bottom"></div>

//       {/* header start */}
//       <div data-elementor-type="wp-post" data-elementor-id="16883" className="elementor elementor-16883">
//         <div className="elementor-element elementor-element-6f9b317 e-flex e-con-boxed e-con e-parent" data-id="6f9b317" data-element_type="container" data-e-type="container">
//           <div className="e-con-inner">
//             <div className="elementor-element elementor-element-d911cd3 elementor-widget elementor-widget-tp-px-header-01" data-id="d911cd3" data-element_type="widget" data-e-type="widget" data-widget_type="tp-px-header-01.default">
//               <div className="elementor-widget-container">
//                 {/* header area start */}
//                 <div className="tp-header-creative">
//                   <header>
//                     <div className="px-header-area header-transparent px-header-ptb px-header-style-black">
//                       <div className="row align-items-center">
//                         <div className="col-lg-4 col-md-3 col-6">
//                           <div className="px-header-logo tp-el-logo">
//                             <a href="/">
//                               <img data-width="90" src="/wp-content/uploads/sites/27/2025/10/logo-orange.png" alt="" />
//                             </a>
//                           </div>
//                         </div>
//                         <div className="col-lg-8 col-md-9 col-6">
//                           <div className="px-header-box d-flex justify-content-end align-items-center">
//                             <div className="px-header-menu tp-header-dropdown dropdown-white-bg d-none d-xl-block">
//                               <nav className="tp-mobile-menu-active">
//                                 <ul id="menu-1-d911cd3" className="tp-nav-menu">
//                                   <li itemScope itemType="https://www.schema.org/SiteNavigationElement" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-12964 has-mega-menu has-dropdown nav-item">
//                                     <a title="Home" href="/" className="nav-links">Home</a>
//                                   </li>
//                                   <li itemScope itemType="https://www.schema.org/SiteNavigationElement" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children dropdown has-dropdown menu-item-13264 nav-item">
//                                     <a title="Pages" href="#" className="nav-links">Pages</a>
//                                     <ul className="tp-submenu submenu sub-menu" role="menu">
//                                       <li className="menu-item nav-item"><a title="About" href="/about-us" className="dropdown-items">About</a></li>
//                                       <li className="menu-item nav-item"><a title="About Me" href="/about-me" className="dropdown-items">About Me</a></li>
//                                       <li className="menu-item nav-item"><a title="Service One" href="/service-1" className="dropdown-items">Service One</a></li>
//                                       <li className="menu-item nav-item"><a title="Service Two" href="/service-2" className="dropdown-items">Service Two</a></li>
//                                       <li className="menu-item nav-item"><a title="Team" href="/team" className="dropdown-items">Team</a></li>
//                                       <li className="menu-item nav-item"><a title="Team Details" href="/team-details" className="dropdown-items">Team Details</a></li>
//                                     </ul>
//                                   </li>
//                                   <li itemScope itemType="https://www.schema.org/SiteNavigationElement" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children dropdown has-dropdown nav-item">
//                                     <a title="Project" href="/portfolio-1" className="nav-links">Project</a>
//                                     <ul className="tp-submenu submenu sub-menu" role="menu">
//                                       <li className="menu-item nav-item"><a title="Portfolio One" href="/portfolio-1" className="dropdown-items">Portfolio One</a></li>
//                                       <li className="menu-item nav-item"><a title="Portfolio Two" href="/portfolio-2" className="dropdown-items">Portfolio Two</a></li>
//                                       <li className="menu-item nav-item"><a title="Portfolio Three" href="/portfolio-3" className="dropdown-items">Portfolio Three</a></li>
//                                     </ul>
//                                   </li>
//                                   <li itemScope itemType="https://www.schema.org/SiteNavigationElement" className="menu-item nav-item">
//                                     <a title="Blog" href="/blog" className="nav-links">Blog</a>
//                                   </li>
//                                   <li itemScope itemType="https://www.schema.org/SiteNavigationElement" className="menu-item nav-item">
//                                     <a title="Contact" href="/contact" className="nav-links">Contact</a>
//                                   </li>
//                                 </ul>
//                               </nav>
//                             </div>
//                             <div className="px-header-action tp-el-block">
//                               <button className="px-header-bar tp-offcanvas-open-btn">
//                                 <span></span>
//                                 <span></span>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </header>
//                 </div>
//                 {/* header area end */}

//                 {/* tp-offcanvus-area-start */}
//                 <div className="tp-offcanvas-area px-offcanvas-style">
//                   <div className="tp-offcanvas-wrapper default">
//                     <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
//                       <div className="tp-offcanvas-logo tp-el-offcanvas-logo">
//                         <a href="/">
//                           <img src="/wp-content/uploads/sites/27/2025/10/logo-orange.png" alt="" />
//                         </a>
//                       </div>
//                       <div className="tp-offcanvas-close">
//                         <button className="tp-offcanvas-close-btn">
//                           <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                             <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="tp-offcanvas-main">
//                       <div data-elementor-type="wp-post" data-elementor-id="13226" className="elementor elementor-13226">
//                         <div className="elementor-element elementor-element-9153d0a e-con-full e-flex e-con e-parent" data-id="9153d0a" data-element_type="container" data-e-type="container">
//                           <div className="elementor-element elementor-element-0334eef elementor-widget elementor-widget-tp-offcanvas-mobile-menu" data-id="0334eef" data-element_type="widget" data-e-type="widget" data-widget_type="tp-offcanvas-mobile-menu.default">
//                             <div className="elementor-widget-container">
//                               <div className="tp-main-menu-mobile tp-offcanvas-menu d-xl-none">
//                                 <nav></nav>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="body-overlay"></div>
//                 {/* tp-offcanvus-area-end */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* header end */}

//       <div id="smooth-wrapper">
//         <div id="smooth-content">
//           <div data-elementor-type="wp-page" data-elementor-id="16393" className="elementor elementor-16393">
//             <div className="elementor-element elementor-element-575c634a e-con-full e-flex e-con e-parent" data-id="575c634a" data-element_type="container" data-e-type="container">
//               <div className="elementor-element elementor-element-11759bc2 elementor-widget elementor-widget-tp-creative-hero" data-id="11759bc2" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-hero.default">
//                 <div className="elementor-widget-container">
//                   {/* bf-hero-area-start */}
//                   <div className="bf-hero-area bf-hero-3-spacing bf-hero-anime-area tp-el-section">
//                     <div className="container">
//                       <div className="row">
//                         <div className="col-12">
//                           <div className="bf-hero-3-wrap">
//                             <h2 className="bf-hero-3-title tp-el-title">
//                               <span className="bf-item-anime-md marque d-inline-block">Craft</span>
//                               <div className="bf-hero-3-title-video d-none d-xl-inline-block">
//                                 <video autoPlay playsInline>
//                                   <source src="https://html.aqlova.com/videos/bfolio/video-4.mp4" type="video/mp4" />
//                                 </video>
//                               </div>
//                               <span className="bf-item-anime marque d-inline-block">CREATIVE</span>
//                               <div className="spacing pr-140 d-inline-block p-relative">
//                                 <span className="bf-item-anime-md marque d-inline-block">experiences</span>
//                                 <img decoding="async" className="bf-hero-3-thumb d-none d-xl-inline-block" src="/wp-content/uploads/2025/11/thumb-2.jpg" alt="" />
//                               </div>
//                               <span className="bf-item-anime marque d-inline-block">that</span>
//                               <div className="spacing pr-35 d-inline-block p-relative">
//                                 <span className="bf-item-anime-md marque d-inline-block">Shape</span>
//                                 <img decoding="async" className="bf-hero-3-thumb-2 d-none d-xl-inline-block" src="/wp-content/uploads/2025/11/thumb.jpg" alt="" />
//                               </div>
//                               <span className="bf-item-anime marque d-inline-block">TOMMOROW.</span>
//                             </h2>
//                           </div>
//                         </div>
//                         <div className="col-lg-6 col-md-3">
//                           <div className="bf-rounded-btn-wrap text-md-end mt-50 mr-185 mb-30">
//                             <div className="btn_wrapper d-inline-block">
//                               <a href="#" target="_self" rel="nofollow" className="bf-btn-rounded btn-item tp-el-btn">
//                                 Discover<br /> Work
//                                 <i className="bf-btn-circle-dot" style={{ background: '' }}></i>
//                               </a>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="col-lg-6 col-md-9">
//                           <div className="bf-hero-3-dec mb-30">
//                             <p className="tp-el-desc">
//                               Pixora is a strategic design partner to bold<br /> digital brands. We join your team, co-build<br /> your thing, and help bring it to the world.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   {/* bf-hero-area-end */}
//                 </div>
//               </div>
//               <div className="elementor-element elementor-element-1f241f56 e-flex e-con-boxed e-con e-child" data-id="1f241f56" data-element_type="container" data-e-type="container">
//                 <div className="e-con-inner">
//                   <div className="elementor-element elementor-element-bd965ab elementor-widget elementor-widget-tp-px-video" data-id="bd965ab" data-element_type="widget" data-e-type="widget" data-widget_type="tp-px-video.default">
//                     <div className="elementor-widget-container">
//                       <div className="bf-hero-3-video-wrap tp-el-section tp-el-video">
//                         <video loop muted autoPlay playsInline>
//                           <source src="https://html.aqlova.com/videos/bfolio/video-3.mp4" type="video/mp4" />
//                         </video>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ABOUT SECTION */}
//             <div className="elementor-element elementor-element-76e3dd75 e-flex e-con-boxed e-con e-parent" data-id="76e3dd75" data-element_type="container" data-e-type="container">
//               <div className="e-con-inner">
//                 <div className="elementor-element elementor-element-2df53b0d e-con-full e-flex e-con e-child" data-id="2df53b0d" data-element_type="container" data-e-type="container">
//                   <div className="elementor-element elementor-element-6df2a0de e-con-full e-flex e-con e-child" data-id="6df2a0de" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-5504614b elementor-widget elementor-widget-heading" data-id="5504614b" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
//                       <span className="elementor-heading-title elementor-size-default">About us</span>
//                     </div>
//                   </div>
//                   <div className="elementor-element elementor-element-1e0cde85 e-con-full e-flex e-con e-child" data-id="1e0cde85" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-b92fbfc elementor-widget elementor-widget-px-heading-animated" data-id="b92fbfc" data-element_type="widget" data-e-type="widget" data-widget_type="px-heading-animated.default">
//                       <div className="elementor-widget-container">
//                         <div className="tp-el-alignment">
//                           <h2 className="tp-section-tittle mb-50 tp-el-title reveal-text tp-el-title-ani" style={{ fontFamily: 'Poppins, sans-serif' }}>
//                             An independent web design and branding agency in Manchester set up 2010 who care, build relationships, have industry experience, and win awards.
//                           </h2>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="elementor-element elementor-element-7f647426 e-con-full e-flex e-con e-child" data-id="7f647426" data-element_type="container" data-e-type="container">
//                   <div className="elementor-element elementor-element-7b090991 e-con-full e-flex e-con e-child" data-id="7b090991" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-390e7eb7 elementor-widget elementor-widget-image" data-id="390e7eb7" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
//                       <img loading="lazy" decoding="async" width="256" height="266" src="/wp-content/uploads/sites/27/2025/11/thumb-4-1.jpg" className="attachment-full size-full wp-image-16401" alt="" />
//                     </div>
//                   </div>
//                   <div className="elementor-element elementor-element-fa08f9 e-con-full e-flex e-con e-child" data-id="fa08f9" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-4f667cf7 elementor-widget elementor-widget-image" data-id="4f667cf7" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
//                       <img loading="lazy" decoding="async" width="306" height="400" src="/wp-content/uploads/sites/27/2025/11/thumb-2-1.jpg" className="attachment-full size-full wp-image-16402" alt="" />
//                     </div>
//                   </div>
//                   <div className="elementor-element elementor-element-3c1fef4e e-con-full e-flex e-con e-child" data-id="3c1fef4e" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-62584d95 elementor-widget elementor-widget-image" data-id="62584d95" data-element_type="widget" data-e-type="widget" data-widget_type="image.default">
//                       <img loading="lazy" decoding="async" width="140" height="54" src="/wp-content/uploads/sites/27/2025/11/avatar.png" className="attachment-full size-full wp-image-16403" alt="" />
//                     </div>
//                     <div className="elementor-element elementor-element-6fd04480 elementor-widget-tablet__width-initial elementor-widget-mobile_extra__width-inherit elementor-widget elementor-widget-heading" data-id="6fd04480" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
//                       <p className="elementor-heading-title elementor-size-default">Driven by a passion for innovation, we specialize in delivering top-quality design solutions</p>
//                     </div>
//                     <div className="elementor-element elementor-element-3ef8a093 e-con-full e-flex e-con e-child" data-id="3ef8a093" data-element_type="container" data-e-type="container">
//                       <div className="elementor-element elementor-element-5b1af467 elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-counter" data-id="5b1af467" data-element_type="widget" data-e-type="widget" data-widget_type="counter.default">
//                         <div className="elementor-counter">
//                           <div className="elementor-counter-title">Clients Satisfied and Repeating</div>
//                           <div className="elementor-counter-number-wrapper">
//                             <span className="elementor-counter-number-prefix"></span>
//                             <span className="elementor-counter-number" data-duration="2000" data-to-value="98" data-from-value="0" data-delimiter=",">0</span>
//                             <span className="elementor-counter-number-suffix">%</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="elementor-element elementor-element-43f754dc elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-counter" data-id="43f754dc" data-element_type="widget" data-e-type="widget" data-widget_type="counter.default">
//                         <div className="elementor-counter">
//                           <div className="elementor-counter-title">Projects Completed in 24 Countries</div>
//                           <div className="elementor-counter-number-wrapper">
//                             <span className="elementor-counter-number-prefix"></span>
//                             <span className="elementor-counter-number" data-duration="2000" data-to-value="125" data-from-value="0" data-delimiter=",">0</span>
//                             <span className="elementor-counter-number-suffix">+</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* SERVICES SECTION */}
//             <div className="elementor-element elementor-element-76e11113 e-con-full e-flex e-con e-parent" data-id="76e11113" data-element_type="container" data-e-type="container">
//               <div className="elementor-element elementor-element-57933a32 e-flex e-con-boxed e-con e-child" data-id="57933a32" data-element_type="container" data-e-type="container" data-settings='{"background_background":"classic"}'>
//                 <div className="e-con-inner">
//                   <div className="elementor-element elementor-element-8e58a1f e-con-full e-flex e-con e-child" data-id="8e58a1f" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-182d1d3b e-con-full e-flex e-con e-child" data-id="182d1d3b" data-element_type="container" data-e-type="container">
//                       <div className="elementor-element elementor-element-535b051b elementor-widget elementor-widget-heading" data-id="535b051b" data-element_type="widget" data-e-type="widget" data-widget_type="heading.default">
//                         <span className="elementor-heading-title elementor-size-default">OUR SERVICES</span>
//                       </div>
//                     </div>
//                     <div className="elementor-element elementor-element-7c811bac e-con-full e-flex e-con e-child" data-id="7c811bac" data-element_type="container" data-e-type="container">
//                       <div className="elementor-element elementor-element-4b47ec7 elementor-widget__width-initial elementor-widget elementor-widget-tp-heading-title" data-id="4b47ec7" data-element_type="widget" data-e-type="widget" data-widget_type="tp-heading-title.default">
//                         <div className="elementor-widget-container">
//                           <div className="tp-el-section text-start">
//                             <h2 className="tp-section-title fs-140 tp-el-title tp_fade_anim" data-delay="0.3">Service we&apos;re always provides</h2>
//                             <div className="tp-el-content tp_text_anim">
//                               <p>Pixora power of our 8+ years of experience. We build excellence works. That will help you to grow your business products.</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="elementor-element elementor-element-48aac6d e-con-full e-flex e-con e-child" data-id="48aac6d" data-element_type="container" data-e-type="container">
//                     {/* Service 1 - Development */}
//                     <div className="elementor-element elementor-element-6ed4b78 elementor-widget elementor-widget-tp-creative-service-box" data-id="6ed4b78" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-service-box.default">
//                       <div className="elementor-widget-container">
//                         <div className="bf-service-item-3 fix tp-el-section">
//                           <div className="row gx-0">
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrap d-flex align-items-center">
//                                 <div className="bf-service-item-3-thumb">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/st-service-1.jpg" alt="" />
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-text">
//                                   <h4 className="bf-service-item-3-title">
//                                     <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">Development</a>
//                                   </h4>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrapper p-relative fix">
//                                 <div className="bf-service-item-3-btn">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-slider">
//                                   <div className="bf-service-item-3-tags">
//                                     <span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Service 2 - Marketing */}
//                     <div className="elementor-element elementor-element-5d7ed40c elementor-widget elementor-widget-tp-creative-service-box" data-id="5d7ed40c" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-service-box.default">
//                       <div className="elementor-widget-container">
//                         <div className="bf-service-item-3 fix tp-el-section">
//                           <div className="row gx-0">
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrap d-flex align-items-center">
//                                 <div className="bf-service-item-3-thumb">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/st-service-2.jpg" alt="" />
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-text">
//                                   <h4 className="bf-service-item-3-title">
//                                     <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">Marketing</a>
//                                   </h4>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrapper p-relative fix">
//                                 <div className="bf-service-item-3-btn">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-slider">
//                                   <div className="bf-service-item-3-tags">
//                                     <span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Service 3 - Graphics */}
//                     <div className="elementor-element elementor-element-2df1cb64 elementor-widget elementor-widget-tp-creative-service-box" data-id="2df1cb64" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-service-box.default">
//                       <div className="elementor-widget-container">
//                         <div className="bf-service-item-3 fix tp-el-section">
//                           <div className="row gx-0">
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrap d-flex align-items-center">
//                                 <div className="bf-service-item-3-thumb">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/st-service-3.jpg" alt="" />
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-text">
//                                   <h4 className="bf-service-item-3-title">
//                                     <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">Graphics</a>
//                                   </h4>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrapper p-relative fix">
//                                 <div className="bf-service-item-3-btn">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-slider">
//                                   <div className="bf-service-item-3-tags">
//                                     <span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Service 4 - Technology */}
//                     <div className="elementor-element elementor-element-2c8ce3be elementor-widget elementor-widget-tp-creative-service-box" data-id="2c8ce3be" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-service-box.default">
//                       <div className="elementor-widget-container">
//                         <div className="bf-service-item-3 fix tp-el-section">
//                           <div className="row gx-0">
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrap d-flex align-items-center">
//                                 <div className="bf-service-item-3-thumb">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/st-service-3.jpg" alt="" />
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-text">
//                                   <h4 className="bf-service-item-3-title">
//                                     <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">Technology</a>
//                                   </h4>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="col-lg-6">
//                               <div className="bf-service-item-3-wrapper p-relative fix">
//                                 <div className="bf-service-item-3-btn">
//                                   <a href="/service-1" target="_self" rel="nofollow" className="common-underline tp-el-title">
//                                     <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
//                                   </a>
//                                 </div>
//                                 <div className="bf-service-item-3-slider">
//                                   <div className="bf-service-item-3-tags">
//                                     <span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span><span>UX Design</span><span>User Testing</span><span>Product Prototype</span><span>Mobile UI</span><span>Web app design</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* PORTFOLIO SECTION */}
//             <div className="elementor-element elementor-element-2376abc1 e-flex e-con-boxed e-con e-parent" data-id="2376abc1" data-element_type="container" data-e-type="container">
//               <div className="e-con-inner">
//                 <div className="elementor-element elementor-element-5152a020 e-con-full e-flex e-con e-child" data-id="5152a020" data-element_type="container" data-e-type="container">
//                   <div className="elementor-element elementor-element-26197acf e-con-full e-flex e-con e-child" data-id="26197acf" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-e6b7600 elementor-widget elementor-widget-px-heading-scroll" data-id="e6b7600" data-element_type="widget" data-e-type="widget" data-widget_type="px-heading-scroll.default">
//                       <div className="elementor-widget-container">
//                         <div className="bf-portfolio-3-title-box tp-el-section title-box">
//                           <div className="design-project-title-box tp-el-alignment">
//                             <h4 className="bf-portfolio-3-sectitle mb-45 tp-el-title">
//                               <span className="tp-text-right-scroll reveal-text tp-el-alignment d-block">recent</span>
//                               <span className="reveal-text tp-el-alignment d-block">work</span>
//                             </h4>
//                             <p className="tp-el-desc">In the creative wilderness, <br />our work becomes the beacon <br />clients grow to love.</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="elementor-element elementor-element-5724acfa e-con-full e-flex e-con e-child" data-id="5724acfa" data-element_type="container" data-e-type="container">
//                     <div className="elementor-element elementor-element-36643e1e elementor-widget elementor-widget-tp-button-common" data-id="36643e1e" data-element_type="widget" data-e-type="widget" data-widget_type="tp-button-common.default">
//                       <div className="elementor-widget-container">
//                         <div>
//                           <a className="tp-btn-yellow-green green-solid btn-60 tp-el-btn inline-flex flex flex-row inline" href="/portfolio-1" target="_self" rel="nofollow">
//                             <span><span className="text-1">Explore Work</span><span className="text-2">Explore Work</span></span>
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="elementor-element elementor-element-29f3dad0 elementor-widget elementor-widget-tp-creative-project-scroll" data-id="29f3dad0" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-project-scroll.default">
//                   <div className="elementor-widget-container">
//                     <div className="bf-portfolio-3-area tp-el-section">
//                       <div className="bf-portfolio-3-item-wrap">
//                         {/* Portfolio Item 1 */}
//                         <div className="bf-portfolio-3-item mb-80 elementor-repeater-item-efaf6cb">
//                           <div className="row align-items-center">
//                             <div className="col-xl-5 order-xl-0 order-1">
//                               <div className="bf-portfolio-3-content tp-el-content">
//                                 <h4 className="bf-portfolio-3-title tp-el-title"><a href="#" target="_self" rel="nofollow">Skillvison</a></h4>
//                                 <span className="mb-50 tp-el-des">Research, UX, UI Design</span>
//                                 <a className="bf-btn bf-btn-border bf-btn-xl d-inline-flex align-items-center tp-el-btn" href="#" target="_self" rel="nofollow">
//                                   <span><span className="text-1">View project</span><span className="text-2">View project</span></span>
//                                 </a>
//                               </div>
//                             </div>
//                             <div className="col-xl-7 order-xl-1 order-0">
//                               <div className="bf-portfolio-3-thumb item-1 text-end">
//                                 <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/portfolio-1.jpg" alt="" />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         {/* Portfolio Item 2 */}
//                         <div className="bf-portfolio-3-item mb-80 elementor-repeater-item-baef054">
//                           <div className="row align-items-center">
//                             <div className="col-xl-7">
//                               <div className="bf-portfolio-3-thumb item-2">
//                                 <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/portfolio-2-1.jpg" alt="" />
//                               </div>
//                             </div>
//                             <div className="col-xl-5">
//                               <div className="bf-portfolio-3-content pl-200 tp-el-content">
//                                 <h4 className="bf-portfolio-3-title tp-el-title"><a href="#" target="_self" rel="nofollow">kashtech</a></h4>
//                                 <span className="mb-50 tp-el-des">Research, UX, UI Design</span>
//                                 <a className="bf-btn bf-btn-border bf-btn-xl d-inline-flex align-items-center tp-el-btn" href="#" target="_self" rel="nofollow">
//                                   <span><span className="text-1">View project</span><span className="text-2">View project</span></span>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         {/* Portfolio Item 3 */}
//                         <div className="bf-portfolio-3-item mb-80 elementor-repeater-item-6891268">
//                           <div className="row align-items-center">
//                             <div className="col-xl-5 order-xl-0 order-1">
//                               <div className="bf-portfolio-3-content tp-el-content">
//                                 <h4 className="bf-portfolio-3-title tp-el-title"><a href="#" target="_self" rel="nofollow">rebrand</a></h4>
//                                 <span className="mb-50 tp-el-des">Research, UX, UI Design</span>
//                                 <a className="bf-btn bf-btn-border bf-btn-xl d-inline-flex align-items-center tp-el-btn" href="#" target="_self" rel="nofollow">
//                                   <span><span className="text-1">View project</span><span className="text-2">View project</span></span>
//                                 </a>
//                               </div>
//                             </div>
//                             <div className="col-xl-7 order-xl-1 order-0">
//                               <div className="bf-portfolio-3-thumb item-1 text-end">
//                                 <img decoding="async" src="/wp-content/uploads/sites/27/2025/11/portfolio-3-1.jpg" alt="" />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* TEXT SLIDER */}
//             <div className="elementor-element elementor-element-4045a863 e-con-full e-flex e-con e-parent" data-id="4045a863" data-element_type="container" data-e-type="container">
//               <div className="elementor-element elementor-element-95d0ad3 elementor-widget elementor-widget-tp-creative-text-slider" data-id="95d0ad3" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-text-slider.default">
//                 <div className="elementor-widget-container">
//                   <div className="tp-text-slider-area bf-text-slider-style tp-el-section">
//                     <div className="tp-text-slide-top">
//                       <div className="swiper-container tp-text-slide-active">
//                         <div className="swiper-wrapper slide-transtion">
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-top-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-top-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-top-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="tp-text-slide-bottom">
//                       <div className="swiper-container tp-text-slide-active" dir="rtl">
//                         <div className="swiper-wrapper slide-transtion">
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-bottom-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-bottom-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                           <div className="swiper-slide"><div className="tp-text-content"><span className="tp-bottom-slider" style={{ fontFamily: 'ThunderMed, sans-serif' }}>Award & recognitions</span></div></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* AWARDS SECTION */}
//             <div className="elementor-element elementor-element-14625b71 e-con-full e-flex e-con e-parent" data-id="14625b71" data-element_type="container" data-e-type="container" data-settings='{"background_background":"classic"}'>
//               <div className="elementor-element elementor-element-7880f643 e-flex e-con-boxed e-con e-child" data-id="7880f643" data-element_type="container" data-e-type="container">
//                 <div className="e-con-inner">
//                   <div className="elementor-element elementor-element-5801558 elementor-widget elementor-widget-tp-award" data-id="5801558" data-element_type="widget" data-e-type="widget" data-widget_type="tp-award.default">
//                     <div className="elementor-widget-container">
//                       <div className="design-award-wrap">
//                         <div className="row row-cols-1">
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">A&apos; Design Awards & competition</h4><span className="tp-el-description">Silver Medal</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">AWWWARDS</h4><span className="tp-el-description">2X - Honnerable</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">CSS Design Awards</h4><span className="tp-el-description">2X - Website of the day</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">2X - Website of the day</h4><span className="tp-el-description">2X - Website of the day</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">CSS Reels</h4><span className="tp-el-description">Featured of the day</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                           <div className="col tp-el-full-bg"><div className="design-award-item hover-reveal-item p-relative tp-el-title-hover"><div className="design-award-content design-award-content-xs d-flex align-items-center justify-content-between"><h4 className="tp-el-title">Web Gurus</h4><span className="tp-el-description">2X - Guru of the day</span></div><div className="design-award-reveal-img" style={{ backgroundImage: 'url(/wp-content/uploads/sites/27/2025/11/award.webp)' }}></div></div></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* CONTACT SECTION */}
//             <div className="elementor-element elementor-element-277beda4 e-flex e-con-boxed e-con e-parent" data-id="277beda4" data-element_type="container" data-e-type="container" data-settings='{"background_background":"classic"}'>
//               <div className="e-con-inner">
//                 <div className="elementor-element elementor-element-7103b69e e-con-full e-flex e-con e-child" data-id="7103b69e" data-element_type="container" data-e-type="container">
//                   <div className="elementor-element elementor-element-73c72e13 elementor-widget elementor-widget-tp-creative-contact-form" data-id="73c72e13" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-contact-form.default">
//                     <div className="elementor-widget-container">
//                       <div className="bf-contact-form tp-el-section">
//                         <span className="bf-contact-subtitle tp-el-subtitle">Pixora@</span>
//                         <h3 className="bf-contact-title mb-25 tp-el-title">Leave a reply</h3>
//                         <div className="tp-page-contact-form">
//                           <form action="/digital-studio/" method="post" className="wpcf7-form init" aria-label="Contact form">
//                             <div className="tp-creative-contact-form">
//                               <div className="tp-contact-form-input mb-15">
//                                 <label className="tp-label" htmlFor="name">Name *</label>
//                                 <input size={40} maxLength={400} className="tp-input" type="text" name="name" />
//                               </div>
//                               <div className="tp-contact-form-input mb-15">
//                                 <label className="tp-label" htmlFor="email">Email *</label>
//                                 <input size={40} maxLength={400} className="tp-input" type="email" name="email" />
//                               </div>
//                               <div className="tp-contact-form-input mb-15">
//                                 <label className="tp-label" htmlFor="textarea">Message *</label>
//                                 <textarea cols={40} rows={10} maxLength={2000} className="tp-input tp-textarea" name="message"></textarea>
//                               </div>
//                               <div>
//                                 <button type="submit" className="tp-btn tp-btn-xl d-inline-flex align-items-center justify-content-center w-100">
//                                   <span><span className="text-1">Send Message</span><span className="text-2">Send Message</span></span>
//                                 </button>
//                               </div>
//                             </div>
//                           </form>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="elementor-element elementor-element-36c36d90 e-con-full e-flex e-con e-child" data-id="36c36d90" data-element_type="container" data-e-type="container">
//                   <h2 className="elementor-heading-title elementor-size-default" style={{ color: '#fff' }}>Let&apos;s talk</h2>
//                   <p style={{ color: 'rgba(255,255,255,0.5)' }}>
//                     <span style={{ color: 'rgba(255,255,255,0.65)' }}>Tell us about your project </span>
//                     —whether it&apos;s a website, SEO, or marketing.
//                   </p>
//                   <div className="row mt-4">
//                     <div className="col-6">
//                       <h3 style={{ color: '#fff' }}>Quick response</h3>
//                       <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>If you&apos;re ready create & collaborate we&apos;d love to hear from you.</p>
//                     </div>
//                     <div className="col-6">
//                       <h3 style={{ color: '#fff' }}>Clear next steps</h3>
//                       <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>If you&apos;re ready create & collaborate we&apos;d love to hear from you.</p>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-start gap-4 mt-4">
//                     <img loading="lazy" width="160" height="178" src="/wp-content/uploads/sites/27/2025/11/thumb-3.jpg" alt="" style={{ borderRadius: 12 }} />
//                     <div>
//                       <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Team lead</span><br />
//                       <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>at Pixora@</span><br />
//                       <span style={{ color: '#fff', fontWeight: 700 }}>Parvej Hossain</span><br />
//                       <a className="tp-btn-yellow-green green-solid btn-60 tp-el-btn inline-flex d-inline-flex mt-2" href="/contact">
//                         <span><span className="text-1">Let&apos;s Talk</span><span className="text-2">Let&apos;s Talk</span></span>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* INSTAGRAM SECTION */}
//             <div className="elementor-element elementor-element-13953ca8 e-con-full e-flex e-con e-parent" data-id="13953ca8" data-element_type="container" data-e-type="container">
//               <div className="elementor-element elementor-element-500b3fcb elementor-widget elementor-widget-tp-creative-instagram" data-id="500b3fcb" data-element_type="widget" data-e-type="widget" data-widget_type="tp-creative-instagram.default">
//                 <div className="elementor-widget-container">
//                   <div className="bf-instagram-area bf-instagram-ptb text-center tp-el-section">
//                     <div className="bf-instagram-thumb-wrap p-relative">
//                       <div className="row g-0">
//                         {['insta-inner-1.jpg', 'insta-inner-2.jpg', 'insta-inner-3.jpg', 'insta-inner-4.jpg', 'insta-inner-5.jpg', 'insta-inner-6.jpg', 'insta-inner-7.jpg'].map((img, i) => (
//                           <div key={i} className="col"><img src={`/wp-content/uploads/sites/27/2025/11/${img}`} alt="" style={{ width: '100%' }} /></div>
//                         ))}
//                         <div className="col d-flex align-items-center justify-content-center" style={{ background: '#FF6B6B' }}>
//                           <i className="fab fa-instagram" style={{ color: '#fff', fontSize: '2rem' }}></i>
//                         </div>
//                       </div>
//                       <div className="bf-instagram-content-wrap text-start" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)', padding: '2rem 3rem', borderRadius: 20 }}>
//                         <span className="bf-instagram-subtitle tp-el-subtitle">INSTAGRAM</span>
//                         <h2 className="bf-instagram-title tp-el-title">@Pixora agency</h2>
//                         <p className="tp-el-desc">Become a part of our stories!<br />Join the adventure.</p>
//                         <a href="#" className="tp-btn d-inline-flex align-items-center tp-el-btn">
//                           <span><span className="text-1">Follow Us</span><span className="text-2">Follow Us</span></span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* FOOTER */}
//           <div data-elementor-type="wp-post" data-elementor-id="16555" className="elementor elementor-16555">
//             <div className="elementor-element elementor-element-329e3021 e-con-full e-flex e-con e-parent" data-id="329e3021" data-element_type="container" data-e-type="container">
//               <div className="elementor-element elementor-element-6084c5aa e-flex e-con-boxed e-con e-child" data-id="6084c5aa" data-element_type="container" data-e-type="container" data-settings='{"background_background":"classic"}'>
//                 <div className="e-con-inner">
//                   <div className="row w-100">
//                     <div className="col-lg-6">
//                       <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff' }}>
//                         Let&apos;s create <span style={{ color: 'rgba(255,255,255,0.65)' }}>something </span>together special
//                       </p>
//                     </div>
//                     <div className="col-lg-6 text-lg-end">
//                       <div className="d-flex gap-3 justify-content-lg-end">
//                         {['instagram', 'dribbble', 'behance', 'youtube'].map((s, i) => (
//                           <a key={i} href="#" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
//                             {s[0].toUpperCase()}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row w-100 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
//                     <div className="col-lg-4">
//                       <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>London</h3>
//                       <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Germany 785 15h Street<br />Office 478 Berlin</a>
//                     </div>
//                     <div className="col-lg-4">
//                       <h3 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Contact</h3>
//                       <a href="tel:+999236542654" style={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>+999 23654 2654</a>
//                       <a href="mailto:manyrooms@help.com" style={{ color: 'rgba(255,255,255,0.5)' }}>manyrooms@help.com</a>
//                     </div>
//                     <div className="col-lg-4">
//                       <div className="d-flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
//                         <input type="email" placeholder="Enter your email" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem 0', outline: 'none' }} />
//                         <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
//                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1L15 8L8 15" stroke="currentColor" strokeWidth="1.5"/></svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row w-100 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
//                     <div className="col-6">
//                       <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>© 2026 <strong>ManyRooms</strong>. All rights reserved.</p>
//                     </div>
//                     <div className="col-6 text-end">
//                       <a href="#" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Scroll to top</a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
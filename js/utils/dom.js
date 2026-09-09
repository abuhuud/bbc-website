/**
 * DOM Helper Utilities
 */
function $(selector, context = document) {
    return context.querySelector(selector);
}

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

function setupScrollReveal() {
    // Light observer for smooth fade-in
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $$('.anim-on-scroll').forEach(el => observer.observe(el));
    }
}

/**
 * Universal SVG Icon Enhancer:
 * Memastikan ikon penting seperti shuttlecock (🏸), petir (⚡), api (🔥),
 * mahkota (👑), dan piala (🏆) selalu tampil 100% sebagai vektor SVG murni
 * tanpa bergantung pada font emoji bawaan OS atau masalah charset di server/Vercel.
 */
let isEnhancing = false;

function BBC_enhanceIcons(context = document.body) {
    if (!context || isEnhancing) return;
    try {
        isEnhancing = true;
        const walker = document.createTreeWalker(context, NodeFilter.SHOW_TEXT, null, false);
        const nodesToReplace = [];
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent) continue;
            const tag = parent.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'input' || tag === 'title' || tag === 'pre' || tag === 'code') continue;
            if (node.nodeValue && (
                node.nodeValue.includes('🏸') ||
                node.nodeValue.includes('⚡') ||
                node.nodeValue.includes('🔥') ||
                node.nodeValue.includes('👑') ||
                node.nodeValue.includes('🏆')
            )) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(textNode => {
            const parent = textNode.parentNode;
            if (!parent) return;
            const replaced = textNode.nodeValue
                .replace(/🏸/g, '<span class="bbc-icon-shuttle" aria-label="Badminton" role="img"></span>')
                .replace(/⚡/g, '<span class="bbc-icon-lightning" aria-label="Smash" role="img"></span>')
                .replace(/🔥/g, '<span class="bbc-icon-fire" aria-label="Match Point" role="img"></span>')
                .replace(/👑/g, '<span class="bbc-icon-crown" aria-label="Player of The Month" role="img"></span>')
                .replace(/🏆/g, '<span class="bbc-icon-trophy" aria-label="Turnamen" role="img"></span>');

            const span = document.createElement('span');
            span.innerHTML = replaced;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, textNode);
            }
            parent.removeChild(textNode);
        });
    } catch (e) {
        console.warn('[BBC Icon Enhancer]', e);
    } finally {
        isEnhancing = false;
    }
}

// Inisialisasi otomatis saat dokumen siap + pantau konten dinamis
if (typeof document !== 'undefined') {
    const initEnhance = () => {
        BBC_enhanceIcons();

        if (typeof MutationObserver !== 'undefined' && document.body) {
            let debounceTimer = null;
            const observer = new MutationObserver(() => {
                if (isEnhancing) return;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    BBC_enhanceIcons();
                }, 80);
            });
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhance);
    } else {
        initEnhance();
    }
}
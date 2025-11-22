// 注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker 注册成功:', registration.scope);

                // 检查更新
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // 新版本可用
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Service Worker 注册失败:', error);
            });
    });
}

function showUpdateNotification() {
    // 显示更新提示
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
        <div class="sw-notification-content">
            <span>🎉 发现新版本</span>
            <button class="sw-refresh-btn" onclick="window.location.reload()">刷新页面</button>
        </div>
    `;

    document.body.appendChild(notification);

    // 添加样式
    if (!document.querySelector('#sw-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'sw-notification-styles';
        style.textContent = `
            .sw-update-notification {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                animation: slideUp 0.3s ease;
            }

            .sw-notification-content {
                background: linear-gradient(135deg, #7b2ff7, #00d4ff);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .sw-refresh-btn {
                background: white;
                color: #7b2ff7;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: transform 0.2s;
            }

            .sw-refresh-btn:hover {
                transform: scale(1.05);
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

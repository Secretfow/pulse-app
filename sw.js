importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBWdArSLBKMgWLAjq3DZ9xgcDUYsv10jvA",
    authDomain: "rodina-d57b8.firebaseapp.com",
    databaseURL: "https://rodina-d57b8-default-rtdb.firebaseio.com",
    projectId: "rodina-d57b8",
    storageBucket: "rodina-d57b8.appspot.com",
    messagingSenderId: "87881339832",
    appId: "1:87881339832:web:c2d61b2027c6a58bd281c5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const DB_VER = 'pulse_rt_v6_';

let listeningRef = null;

// Слушаем команды от основного сайта
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INIT_LISTENER') {
        const userId = event.data.uid;
        startBackgroundListener(userId);
    }
});

function startBackgroundListener(uid) {
    if (listeningRef) return; // Уже слушаем

    console.log('[SW] Запущен фоновый слушатель для:', uid);
    listeningRef = db.ref(`${DB_VER}userChats/${uid}`);

    listeningRef.on('child_changed', (snapshot) => {
        const chatData = snapshot.val();
        
        // Если сообщение от меня — игнорируем
        if (String(chatData.sender) === String(uid)) return;

        // Если есть непрочитанные
        if (chatData.unread > 0) {
            // Проверяем, открыт ли сайт прямо сейчас у пользователя
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
                const isFocused = windowClients.some(client => client.focused);

                // Показываем уведомление, ТОЛЬКО если сайт свернут (не в фокусе)
                if (!isFocused) {
                    const title = "PULSE CHAT";
                    const options = {
                        body: chatData.lastText || "Новое сообщение",
                        icon: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
                        vibrate: [200, 100, 200],
                        tag: snapshot.key // Чтобы не дублировать уведомления
                    };
                    
                    self.registration.showNotification(title, options);
                }
            });
        }
    });
}

// При клике на уведомление открываем чат
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Если вкладка открыта — переходим в нее
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если нет — открываем новую
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
// Service Worker ديال حساب الصالة — كيستقبل الإشعارات (push) ويبانها، وكيودي المستخدم للتطبيق كي يضغط عليها

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  var data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "حساب الصالة", body: event.data ? event.data.text() : "" };
  }

  var title = data.title || "حساب الصالة";
  var options = {
    body: data.body || "",
    tag: data.tag || "hasbatsalla-notif",
    renotify: true,
    data: { url: data.url || "./" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var targetUrl = (event.notification.data && event.notification.data.url) || "./";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ("focus" in client) {
          client.postMessage({ type: "notification-click", url: targetUrl });
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});

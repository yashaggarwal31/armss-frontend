window.onload = () => {
  isLogout();
};

document.addEventListener("DOMContentLoaded", async () => {
  await getMainHtml();
  await getHtml();
});

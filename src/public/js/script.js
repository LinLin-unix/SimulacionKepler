function closeAlert(element) {
    const alert = element.parentElement;
    alert.style.opacity = '0';
    setTimeout(() => {
        alert.remove();
    }, 500);
}
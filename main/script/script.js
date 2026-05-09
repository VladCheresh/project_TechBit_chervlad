"use strict";
const defaultProfile = {
    avatarUrl: "images/TechBit-logo.png",
    name: "TechBit",
    description: "Решаем ваши проблемы нашими силами"
};
// Элементы профиля:
const profileElements = {
    avatar: document.getElementById('profile-avatar'),
    name: document.getElementById('profile-name'),
    description: document.getElementById('profile-description'),
};
// Элементы формы:
const formElements = {
    form: document.getElementById('settings-form'),
    avatarInput: document.getElementById('avatar-input'),
    nameInput: document.getElementById('name-input'),
    descriptionInput: document.getElementById('description-input'),
};
// Переменная для отслеживания изменения аватарки:
let selectedAvatarFile = null;
// Функция для проверки что строка не пустая:
function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
formElements.avatarInput.addEventListener('change', (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение.');
            input.value = '';
            return;
        }
        selectedAvatarFile = file;
    }
});
// Реакция формы на подтверждение отправки данных:
formElements.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = formElements.nameInput.value.trim();
    const description = formElements.descriptionInput.value.trim();
    // Валидация:
    if (isNonEmptyString(name) === false || isNonEmptyString(description) === false) {
        alert('Имя и описание обязательны для заполнения.');
        return;
    }
    // Формируем FormData:
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    const avatarFile = formElements.avatarInput.files?.[0];
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }
    try {
        // Отправляем на тестовый сервер:
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: formData, // для FormData заголовок Content-Type браузер установит сам
        });
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        if (selectedAvatarFile !== null) {
            const newURL = URL.createObjectURL(selectedAvatarFile);
            profileElements.avatar.src = newURL;
            selectedAvatarFile = null;
        }
        profileElements.name.textContent = name;
        profileElements.description.textContent = description;
        formElements.avatarInput.value = ''; // очищаем поле файла
        alert('Профиль обновлён!');
    }
    catch (error) {
        console.error(error);
        alert('Не удалось обновить профиль.');
    }
});
// Сброс данных кнопкой:
formElements.form.addEventListener('reset', (event) => {
    event.preventDefault();
    profileElements.avatar.src = defaultProfile.avatarUrl;
    profileElements.name.textContent = defaultProfile.name;
    profileElements.description.textContent = defaultProfile.description;
});

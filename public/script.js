document.addEventListener('DOMContentLoaded', () => {
    const addPetForm = document.getElementById('add-pet-form');
    const petsTableBody = document.getElementById('pets-table-body');
    const noPetsMessage = document.getElementById('no-pets-message');
    const messageBox = document.getElementById('message-box');

    const serverInfoSpan = document.getElementById('server-info');

    // Función para obtener y mostrar el nombre del servidor
    async function loadServerInfo() {
        try {
            const response = await fetch('/api/server-info');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            serverInfoSpan.textContent = data.serverName;
        } catch (error) {
            console.error('Error al obtener la información del servidor:', error);
            serverInfoSpan.textContent = 'Error al cargar info del servidor';
            serverInfoSpan.classList.add('text-red-600');
        }
    }

    // Llama a la nueva función al cargar la página
    loadServerInfo();

    // Mostrar mensajes de éxito o error
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove('hidden', 'text-green-600', 'text-red-600');
        if (isError) {
            messageBox.classList.add('text-red-600');
        } else {
            messageBox.classList.add('text-green-600');
        }
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }

    // Renderizar una mascota en la tabla
    function renderPet(pet) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-100';

        row.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap">${pet.Id}</td>
            <td class="py-3 px-6 text-left">${pet.Nombre}</td>
            <td class="py-3 px-6 text-left">${pet.Tipo}</td>
            <td class="py-3 px-6 text-left">${pet.Edad}</td>
            <td class="py-3 px-6 text-left">${pet.Raza || ''}</td>
        `;

        petsTableBody.appendChild(row);
    }

    // Cargar mascotas desde el backend
    async function loadPets() {
        try {
            const response = await fetch('/api/pets');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const pets = await response.json();
            petsTableBody.innerHTML = '';

            if (pets.length === 0) {
                noPetsMessage.classList.remove('hidden');
            } else {
                noPetsMessage.classList.add('hidden');
                pets.forEach(pet => renderPet(pet));
            }

        } catch (error) {
            console.error('Error al cargar mascotas:', error);
            showMessage(`Error al cargar mascotas: ${error.message}`, true);
        }
    }

    // Manejar envío del formulario para añadir mascota
    addPetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addPetForm);
        const pet = {
            Nombre: formData.get('name'),
            Tipo: formData.get('type'),
            Edad: parseInt(formData.get('age'), 10),
            Raza: formData.get('breed')
        };

        try {
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pet)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            showMessage('Mascota añadida con éxito.');
            addPetForm.reset();
            loadPets();

        } catch (error) {
            console.error('Error al añadir mascota:', error);
            showMessage(`Error al añadir mascota: ${error.message}`, true);
        }
    });

    // Cargar mascotas al iniciar la aplicación
    loadPets();
});

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import './ProfilePage.css';
import ProfileService from '../../../Services/ProfileService';

const ProfilePage = () => {
    // Estado para los datos del usuario (texto)
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        receiveNotifications: false,
        profilePictureUrl: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Estado para el modo edición
    const [isEditing, setIsEditing] = useState(false);
    
    // Estado para errores de validación del frontend
    const [errors, setErrors] = useState({});
    
    // Estado para la carga (global para la página)
    const [isLoading, setIsLoading] = useState(true);
    
    // Estado para los mensajes de éxito/error del servidor
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });

    // Estado para el archivo de imagen seleccionado
    const [selectedFile, setSelectedFile] = useState(null);
    
    // Referencia al input de archivo para poder resetearlo
    const fileInputRef = useRef(null);

    // --- Carga de Datos Inicial ---
    useEffect(() => {
        setIsLoading(true);
        ProfileService.getMyProfile()
            .then(response => {
                const { username, email, receiveNotifications, profilePictureUrl } = response.data;
                setUserInfo(prevInfo => ({
                    ...prevInfo,
                    username,
                    email,
                    receiveNotifications,
                    profilePictureUrl: profilePictureUrl || '',
                }));
            })
            .catch(error => {
                console.error("Error al cargar el perfil:", error);
                setServerMessage({ type: 'error', text: 'Error al cargar tu perfil. ¿Estás logueado?' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []); // Se ejecuta solo una vez al cargar la página

    // Manejador para los campos de texto y checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Manejador para el campo de archivo
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // --- Lógica de Envío de Formularios ---

    // 1. Validar el formulario de texto
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (userInfo.username.length < 4) newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres.';
        if (!emailRegex.test(userInfo.email)) newErrors.email = 'Por favor, introduce un correo válido.';
        
        if (userInfo.newPassword || userInfo.confirmPassword) {
            if (!userInfo.currentPassword) newErrors.currentPassword = 'Debes ingresar tu contraseña actual para cambiarla.';
            if (userInfo.newPassword.length < 6) newErrors.newPassword = 'La nueva contraseña debe tener al menos 6 caracteres.';
            if (userInfo.newPassword !== userInfo.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 2. Manejador para SUBIR LA FOTO
    const handlePictureUpload = async () => {
        if (!selectedFile) {
            setServerMessage({ type: 'error', text: 'Por favor, selecciona un archivo primero.' });
            return;
        }
        setIsLoading(true);
        setServerMessage({ type: '', text: '' });
        try {
            const response = await ProfileService.uploadProfilePicture(selectedFile);
            setUserInfo(prev => ({ ...prev, profilePictureUrl: response.data.profilePictureUrl }));
            setServerMessage({ type: 'success', text: '¡Foto de perfil actualizada!' });
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null; // Resetea el input
        } catch (error) {
            console.error('Error al subir la foto:', error);
            setServerMessage({ type: 'error', text: 'Error al subir la foto (quizás es muy grande o no es una imagen).' });
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Manejador para GUARDAR LOS CAMBIOS (username, email, clave)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage({ type: '', text: '' });
        if (!validateForm()) return;
        setIsLoading(true);

        const tasks = [];
        let passwordChangeRequested = userInfo.newPassword && userInfo.currentPassword;

        // Tarea 1: Actualizar datos del perfil
        const profileData = {
            username: userInfo.username,
            email: userInfo.email,
            receiveNotifications: userInfo.receiveNotifications,
            // (La URL ya no se envía desde aquí)
        };
        tasks.push(ProfileService.updateMyProfile(profileData));

        // Tarea 2: Cambiar contraseña (si se pidió)
        if (passwordChangeRequested) {
            tasks.push(ProfileService.changePassword({
                oldPassword: userInfo.currentPassword,
                newPassword: userInfo.newPassword,
            }));
        }

        try {
            await Promise.all(tasks);
            setServerMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
            setIsEditing(false);
            setUserInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            console.error('Error al actualizar:', error);
            const errorMsg = error.response?.data || 'Error al guardar. Inténtalo de nuevo.';
            setServerMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    // --- Renderizado ---

    if (isLoading && !userInfo.username) {
        return (
            <div>
                <Header />
                <main className="profile-page-container">
                    <h1 className="profile-title">Cargando perfil...</h1>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="profile-page-container">
                <h1 className="profile-title">Mi Perfil</h1>

                {serverMessage.text && (
                    <div className={`server-message ${serverMessage.type}`}>
                        {serverMessage.text}
                    </div>
                )}

                {/* --- SECCIÓN DE FOTO DE PERFIL --- */}
                {userInfo.profilePictureUrl && (
                    <div className="profile-picture-preview">
                        {/* La key={userInfo.profilePictureUrl} fuerza a React a recargar la img */}
                        <img src={userInfo.profilePictureUrl} alt="Foto de perfil" key={userInfo.profilePictureUrl} />
                    </div>
                )}
                
                {/* Mostramos la subida de archivos solo si estamos editando */}
                {isEditing && (
                    <section className="profile-section">
                        <h2>Foto de Perfil</h2>
                        <FormField
                            label="Seleccionar nueva foto"
                            type="file"
                            name="profilePictureFile"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg" // Acepta solo imágenes
                            ref={fileInputRef}
                        />
                        <Button
                            type="button"
                            onClick={handlePictureUpload}
                            disabled={!selectedFile || isLoading}
                        >
                            {isLoading ? 'Subiendo...' : 'Subir Foto'}
                        </Button>
                    </section>
                )}
                
                {/* --- FORMULARIO DE INFORMACIÓN --- */}
                <form className="profile-form" onSubmit={handleSubmit} noValidate>
                    <section className="profile-section">
                        <h2>Información Personal</h2>
                        <FormField
                            label="Nombre de Usuario"
                            type="text"
                            name="username"
                            value={userInfo.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            error={errors.username}
                        />
                        <FormField
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            error={errors.email}
                        />
                    </section>

                    {isEditing && (
                        <section className="profile-section">
                            <h2>Cambiar Contraseña</h2>
                            <p className="password-note">Deja los campos en blanco si no quieres cambiar tu contraseña.</p>
                            <FormField
                                label="Contraseña Actual"
                                type="password"
                                name="currentPassword"
                                value={userInfo.currentPassword}
                                onChange={handleChange}
                                error={errors.currentPassword}
                            />
                            <FormField
                                label="Nueva Contraseña"
                                type="password"
                                name="newPassword"
                                value={userInfo.newPassword}
                                onChange={handleChange}
                                error={errors.newPassword}
                            />
                            <FormField
                                label="Confirmar Nueva Contraseña"
                                type="password"
                                name="confirmPassword"
                                value={userInfo.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />
                        </section>
                    )}

                    <section className="profile-section">
                        <h2>Preferencias</h2>
                        <div className="checkbox-field">
                            <label htmlFor="receiveNotifications">
                                <input
                                    type="checkbox"
                                    id="receiveNotifications"
                                    name="receiveNotifications"
                                    checked={userInfo.receiveNotifications}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                                Quiero recibir ofertas y novedades en mi correo.
                            </label>
                        </div>
                    </section>
                    
                    {/* --- BOTONES DE ACCIÓN --- */}
                    <div className="profile-actions">
                        {isEditing ? (
                            <>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : (
                            <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                                Editar Perfil
                            </button>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProfilePage;
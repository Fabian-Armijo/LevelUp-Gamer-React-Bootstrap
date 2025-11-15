import React, { useState, useEffect, useRef } from 'react';
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import { ProgressBar } from 'react-bootstrap'; // <-- 1. IMPORTA LA BARRA DE PROGRESO
import './ProfilePage.css';
import ProfileService from '../../../services/ProfileService';

const ProfilePage = () => {
    // 2. Estado inicial (ya incluye los nuevos campos)
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        receiveNotifications: false,
        profilePictureUrl: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        userRole: '',
        pointsBalance: 0,
        userLevel: 1,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // 3. 'useEffect' que carga todos los datos del perfil
    useEffect(() => {
        setIsLoading(true);
        ProfileService.getMyProfile()
            .then(response => {
                const {
                    username, email, receiveNotifications, profilePictureUrl,
                    userRole, pointsBalance, userLevel // Carga los datos de Duoc
                } = response.data;
                
                setUserInfo(prevInfo => ({
                    ...prevInfo,
                    username,
                    email,
                    receiveNotifications,
                    profilePictureUrl: profilePictureUrl || '',
                    userRole: userRole || 'ROLE_USER',
                    pointsBalance: pointsBalance || 0,
                    userLevel: userLevel || 1,
                }));
            })
            .catch(error => {
                console.error("Error al cargar el perfil:", error);
                setServerMessage({ type: 'error', text: 'Error al cargar tu perfil. ¿Estás logueado?' });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // ... (Tus funciones 'handleChange', 'handleFileChange', 'validateForm', 'handlePictureUpload', y 'handleSubmit' no necesitan cambios)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

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
            if (fileInputRef.current) fileInputRef.current.value = null; 
        } catch (error) {
            console.error('Error al subir la foto:', error);
            setServerMessage({ type: 'error', text: 'Error al subir la foto (quizás es muy grande o no es una imagen).' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage({ type: '', text: '' });
        if (!validateForm()) return;
        setIsLoading(true);

        const tasks = [];
        let passwordChangeRequested = userInfo.newPassword && userInfo.currentPassword;

        const profileData = {
            username: userInfo.username,
            email: userInfo.email,
            receiveNotifications: userInfo.receiveNotifications,
        };
        tasks.push(ProfileService.updateMyProfile(profileData));

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


    // --- 4. LÓGICA DE LA BARRA DE PROGRESO ---
    const user = userInfo; // Alias para legibilidad
    const currentLevel = user.userLevel;
    const currentPoints = user.pointsBalance;

    // Define los puntos necesarios para cada nivel
    const LEVEL_GOALS = { 1: 50000, 2: 100000, 3: 150000, 4: 150000 };
    // Define los puntos iniciales de cada nivel
    const LEVEL_START_POINTS = { 1: 0, 2: 50000, 3: 100000, 4: 150000 };

    let progressPercent = 0;
    let pointsForNextLevel = 0;
    let nextLevelGoalText = "";

    if (currentLevel < 4) {
      const startPoints = LEVEL_START_POINTS[currentLevel];
      const goalPoints = LEVEL_GOALS[currentLevel];
      
      const pointsInCurrentLevel = currentPoints - startPoints;
      const pointsNeededForLevel = goalPoints - startPoints;
      
      // Asegurarse de que el porcentaje no sea negativo o más de 100
      const calculatedPercent = (pointsInCurrentLevel / pointsNeededForLevel) * 100;
      progressPercent = Math.max(0, Math.min(100, calculatedPercent));
      
      pointsForNextLevel = goalPoints - currentPoints;
      nextLevelGoalText = `${currentPoints.toLocaleString('es-CL')} / ${goalPoints.toLocaleString('es-CL')} Pts.`;
    } else {
      // Es Nivel 4 (máximo)
      progressPercent = 100;
      pointsForNextLevel = 0;
      nextLevelGoalText = "¡Nivel Máximo Alcanzado!";
    }
    // --- FIN DE LA LÓGICA ---


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
                        <img src={userInfo.profilePictureUrl} alt="Foto de perfil" key={userInfo.profilePictureUrl} />
                    </div>
                )}
                
                {isEditing && (
                    <section className="profile-section">
                        <h2>Foto de Perfil</h2>
                        <FormField
                            label="Seleccionar nueva foto"
                            type="file"
                            name="profilePictureFile"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg"
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

                {/* --- 5. ¡SECCIÓN DE RECOMPENSAS ACTUALIZADA! --- */}
                {userInfo.userRole === 'ROLE_DUOC' && (
                    <section className="profile-section rewards-section">
                        <h2>Mis Recompensas Duoc</h2>
                        <div className="profile-rewards-grid">
                            <div className="reward-item">
                                <span className="reward-label">Nivel</span>
                                <span className="reward-value">Nivel {userInfo.userLevel} / 4</span>
                            </div>
                            <div className="reward-item">
                                <span className="reward-label">Puntos</span>
                                <span className="reward-value">{userInfo.pointsBalance.toLocaleString('es-CL')} Pts.</span>
                            </div>
                        </div>

                        {/* --- BARRA DE PROGRESO --- */}
                        <div className="progress-bar-container">
                          {currentLevel < 4 ? (
                            <>
                              <p>Puntos para Nivel {currentLevel + 1}: <strong>{pointsForNextLevel.toLocaleString('es-CL')} Pts.</strong></p>
                              <ProgressBar 
                                now={progressPercent} 
                                label={nextLevelGoalText}
                                variant="info" // Color de la barra
                                animated 
                              />
                            </>
                          ) : (
                            <>
                              <p>¡Felicidades! Has alcanzado el Nivel Máximo.</p>
                              <ProgressBar now={100} label={nextLevelGoalText} variant="success" />
                            </>
                          )}
                        </div>
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
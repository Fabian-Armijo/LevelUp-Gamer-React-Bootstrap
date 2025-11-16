import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import { ProgressBar } from 'react-bootstrap'; // Importa la barra de progreso
import './ProfilePage.css';
import ProfileService from '../../../services/ProfileService'; // Asegúrate que la ruta sea correcta

const ProfilePage = () => {
    const navigate = useNavigate(); // Para el botón de recompensas

    // Estado para los datos del usuario (incluye todo)
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
        totalPointsEarned: 0
    });

    // Estados de UI
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Carga de Datos Inicial
    useEffect(() => {
        setIsLoading(true);
        ProfileService.getMyProfile()
            .then(response => {
                const { 
                    username, email, receiveNotifications, profilePictureUrl,
                    userRole, pointsBalance, userLevel, totalPointsEarned 
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
                    totalPointsEarned: totalPointsEarned || 0 
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

    // --- Manejadores de Formularios ---

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

    const handleGoToRewards = () => {
        navigate('/recompensas');
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
    
    // Este handleSubmit es para el formulario principal
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
            setIsEditing(false); // Sale del modo edición
            setUserInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            console.error('Error al actualizar:', error);
            const errorMsg = error.response?.data || 'Error al guardar. Inténtalo de nuevo.';
            setServerMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };


    // --- Lógica de la Barra de Progreso (sin cambios) ---
    const user = userInfo; 
    const currentLevel = user.userLevel;
    const currentPoints = user.totalPointsEarned; 
    const LEVEL_GOALS = { 1: 50000, 2: 100000, 3: 150000, 4: 150000 };
    const LEVEL_START_POINTS = { 1: 0, 2: 50000, 3: 100000, 4: 150000 };
    let progressPercent = 0;
    let pointsForNextLevel = 0;
    let nextLevelGoalText = "";
    if (currentLevel < 4) {
      const startPoints = LEVEL_START_POINTS[currentLevel];
      const goalPoints = LEVEL_GOALS[currentLevel];
      const pointsInCurrentLevel = currentPoints - startPoints;
      const pointsNeededForLevel = goalPoints - startPoints;
      const calculatedPercent = (pointsInCurrentLevel / pointsNeededForLevel) * 100;
      progressPercent = Math.max(0, Math.min(100, calculatedPercent));
      pointsForNextLevel = goalPoints - currentPoints;
      nextLevelGoalText = `${currentPoints.toLocaleString('es-CL')} / ${goalPoints.toLocaleString('es-CL')} Pts. Totales`;
    } else {
      progressPercent = 100;
      nextLevelGoalText = "¡Nivel Máximo Alcanzado!";
    }

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

                {/* --- SECCIÓN DE RECOMPENSAS (CON BOTÓN) --- */}
                {userInfo.userRole === 'ROLE_DUOC' && (
                    <section className="profile-section rewards-section">
                        <div className="rewards-header">
                            <h2>Mis Recompensas Duoc</h2>
                            <Button 
                                onClick={handleGoToRewards} // Usa el manejador onClick
                                variant="outline-info" 
                                size="sm"
                            >
                                Ir a la Tienda de Puntos
                            </Button>
                        </div>
                        <div className="profile-rewards-grid">
                            <div className="reward-item">
                                <span className="reward-label">Nivel (Pts. Totales)</span>
                                <span className="reward-value">Nivel {userInfo.userLevel} / 4</span>
                            </div>
                            <div className="reward-item">
                                <span className="reward-label">Puntos para Canjear</span>
                                <span className="reward-value">{userInfo.pointsBalance.toLocaleString('es-CL')} Pts.</span>
                            </div>
                        </div>
                        <div className="progress-bar-container">
                          {currentLevel < 4 ? (
                            <>
                              <p>Progreso Total para Nivel {currentLevel + 1}: <strong>{pointsForNextLevel.toLocaleString('es-CL')} Pts.</strong></p>
                              <ProgressBar 
                                now={progressPercent} 
                                label={nextLevelGoalText}
                                variant="info"
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
                
                {/* --- ¡¡EL FORMULARIO DE EDICIÓN QUE FALTABA!! --- */}
                <form className="profile-form" onSubmit={handleSubmit} noValidate>
                    {/* Esta sección muestra tu información y la puedes editar */}
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

                    {/* Esta sección solo aparece cuando estás editando */}
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

                    {/* Esta sección también se puede editar */}
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
                    
                    {/* ¡LOS BOTONES DE ACCIÓN QUE FALTABAN! */}
                    <div className="profile-actions">
                        {isEditing ? (
                            <>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setIsEditing(false)} // Te permite cancelar la edición
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
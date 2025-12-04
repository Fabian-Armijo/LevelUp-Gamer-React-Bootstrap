import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import { ProgressBar } from 'react-bootstrap';
import './ProfilePage.css';
import ProfileService from '../../../services/ProfileService';
import { useAuth } from '../../../context/AuthContext';
import OrderHistory from '../../molecules/OrderHistory/OrderHistory'; 

const ProfilePage = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth(); 
    const [activeTab, setActiveTab] = useState('profile'); 

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

    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState({ type: '', text: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

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
                    profilePictureUrl: profilePictureUrl ? `${profilePictureUrl}?t=${Date.now()}` : '',
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

    const handleGoToRewards = () => {
        navigate('/recompensas');
    };

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
            const newUrlWithCacheBust = `${response.data.profilePictureUrl}?t=${Date.now()}`;
            
            setUserInfo(prev => ({ ...prev, profilePictureUrl: newUrlWithCacheBust }));
            await refreshUser();

            setServerMessage({ type: 'success', text: '¡Foto de perfil actualizada!' });
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null; 
        } catch (error) {
            console.error('Error al subir la foto:', error);
            const errorMsg = error.response?.data?.message || 'Error al subir la foto.';
            setServerMessage({ type: 'error', text: errorMsg });
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
            await refreshUser();
            setServerMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
            setIsEditing(false); 
            setUserInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            console.error('Error al actualizar:', error);
            const errorMsg = error.response?.data?.message || 'Error al guardar. Inténtalo de nuevo.';
            setServerMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    const currentLevel = userInfo.userLevel;
    const currentPoints = userInfo.totalPointsEarned; 
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

    if (isLoading && !userInfo.username) {
        return <div><Header /><div className="container mt-5"><h2>Cargando...</h2></div></div>;
    }

    const isAdmin = userInfo.userRole === 'ROLE_ADMIN';

    const handleGoToAdminDashboard = () => {
        navigate('/admin/dashboard');
    };

    return (
        <div className="profile-page-wrapper">
            <Header />
            
            <div className="dashboard-container">
                <aside className="dashboard-sidebar">
                    <div className="sidebar-user-summary">
                        <div className="sidebar-avatar">
                            {userInfo.profilePictureUrl ? (
                                <img 
                                    src={userInfo.profilePictureUrl} 
                                    alt="Avatar" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/333/FFF?text=P"; }}
                                />
                            ) : (
                                <div className="avatar-placeholder">{userInfo.username.charAt(0).toUpperCase()}</div>
                            )}
                        </div>
                        <h3>{userInfo.username}</h3>
                        <span className="level-badge">Nivel {userInfo.userLevel}</span>
                    </div>

                    <nav className="sidebar-nav">
                        {isAdmin && (
                            <button 
                                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Dashboard Admin
                            </button>
                        )}
                        <button 
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Mi Perfil
                        </button>
                        <button 
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Mis Compras
                        </button>
                    </nav>
                </aside>

                <main className="dashboard-content">
                    {serverMessage.text && (
                        <div className={`server-message ${serverMessage.type} mb-4`}>{serverMessage.text}</div>
                    )}

                    {activeTab === 'dashboard' && isAdmin ? (
                        <div className="admin-dashboard-content">
                            <h1 className="profile-title">Panel de Administración</h1>
                            <section className="profile-section">
                                <h2>Gestión Rápida</h2>
                                <p>Bienvenido, Administrador. Desde aquí puedes acceder a las herramientas de moderación y gestión de tu eCommerce.</p>
                                <ul className="list-unstyled mt-3">
                                    <li>- Moderar Reseñas (desde detalles de producto)</li>
                                    <li>- Revisar Estadísticas de Ventas </li>
                                </ul>
                                <Button className="mt-4" onClick={handleGoToAdminDashboard}>
                                    Gestión de Contenido (Ruta /admin)
                                </Button>
                            </section>
                        </div>
                    ) : activeTab === 'orders' ? (
                        <div className="orders-tab-content">
                             <h1 className="profile-title">Historial de Compras</h1>
                             <OrderHistory /> 
                        </div>
                    ) : (
                        <div className="profile-tab-content">
                            <h1 className="profile-title">Mi Perfil</h1>

                            {userInfo.userRole === 'ROLE_DUOC' && (
                                <section className="profile-section rewards-section mb-4">
                                    <div className="rewards-header">
                                        <h2>Mis Recompensas</h2>
                                        <Button onClick={handleGoToRewards} variant="outline-info" size="sm">
                                            Tienda de Puntos
                                        </Button>
                                    </div>
                                    <div className="profile-rewards-grid">
                                        <div className="reward-item">
                                            <span className="reward-label">Nivel (Pts. Totales)</span>
                                            <span className="reward-value">Nivel {userInfo.userLevel} / 4</span>
                                        </div>
                                        <div className="reward-item">
                                            <span className="reward-label">Puntos Disponibles</span>
                                            <span className="reward-value">{userInfo.pointsBalance.toLocaleString('es-CL')}</span>
                                        </div>
                                    </div>
                                    <div className="progress-bar-container">
                                        {currentLevel < 4 ? (
                                            <>
                                                <p>Progreso Nivel {currentLevel + 1}: <strong>{pointsForNextLevel.toLocaleString('es-CL')} Pts.</strong></p>
                                                <ProgressBar now={progressPercent} label={nextLevelGoalText} variant="info" animated />
                                            </>
                                        ) : (
                                            <ProgressBar now={100} label="¡Nivel Máximo!" variant="success" />
                                        )}
                                    </div>
                                </section>
                            )}

                            <form className="profile-form" onSubmit={handleSubmit} noValidate>
                                <section className="profile-section mb-4">
                                    <h2>Información Personal</h2>
                                    <FormField 
                                        label="Nombre de Usuario" 
                                        type="text"
                                        name="username" 
                                        value={userInfo.username} 
                                        onChange={handleChange} 
                                        disabled={!isEditing || isLoading} 
                                        error={errors.username} 
                                    />
                                    <FormField 
                                        label="Correo Electrónico" 
                                        type="email"
                                        name="email" 
                                        value={userInfo.email} 
                                        onChange={handleChange} 
                                        disabled={!isEditing || isLoading} 
                                        error={errors.email} 
                                    />

                                    {isEditing && (
                                        <div className="mt-4 pt-3 border-top border-secondary">
                                            <label className="form-label">Cambiar Foto de Perfil</label>
                                            <div className="d-flex gap-2">
                                                <input 
                                                    type="file" 
                                                    className="form-control bg-dark text-light" 
                                                    onChange={handleFileChange} 
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    disabled={isLoading}
                                                />
                                                <Button type="button" onClick={handlePictureUpload} disabled={!selectedFile || isLoading}>
                                                    {isLoading && selectedFile ? 'Subiendo...' : 'Subir'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {isEditing && (
                                    <section className="profile-section mb-4">
                                        <h2>Cambiar Contraseña</h2>
                                        <p className="password-note">Deja los campos en blanco si no quieres cambiarla.</p>
                                        <FormField label="Contraseña Actual" type="password" name="currentPassword" value={userInfo.currentPassword} onChange={handleChange} error={errors.currentPassword} disabled={isLoading} />
                                        <FormField label="Nueva Contraseña" type="password" name="newPassword" value={userInfo.newPassword} onChange={handleChange} error={errors.newPassword} disabled={isLoading} />
                                        <FormField label="Confirmar Nueva Contraseña" type="password" name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} error={errors.confirmPassword} disabled={isLoading} />
                                    </section>
                                )}

                                <section className="profile-section mb-4">
                                    <h2>Preferencias</h2>
                                    <div className="checkbox-field">
                                        <label htmlFor="receiveNotifications">
                                            <input
                                                type="checkbox"
                                                id="receiveNotifications"
                                                name="receiveNotifications"
                                                checked={userInfo.receiveNotifications}
                                                onChange={handleChange}
                                                disabled={!isEditing || isLoading}
                                            />
                                            Quiero recibir ofertas y novedades en mi correo.
                                        </label>
                                    </div>
                                </section>
                                
                                <div className="profile-actions d-flex justify-content-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                            </Button>
                                            <button 
                                                type="button" 
                                                className="cancel-button btn btn-outline-secondary" 
                                                onClick={() => { setIsEditing(false); setErrors({}); setServerMessage({ type: '', text: '' }); }}
                                                disabled={isLoading}
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            type="button" 
                                            className="edit-button btn btn-primary" 
                                            onClick={() => setIsEditing(true)}
                                            disabled={isLoading}
                                        >
                                            Editar Perfil
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
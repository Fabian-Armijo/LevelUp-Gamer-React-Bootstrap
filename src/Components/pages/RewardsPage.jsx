import React, { useState, useMemo } from 'react'; // <-- 1. Importa useMemo
import { useAuth } from '../../context/AuthContext';
import RewardsService from '../../Services/RewardsService';
import Header from '../organisms/Header/Header';
import { Button } from 'react-bootstrap';


// Define tus recompensas
const REWARDS = [
    { id: 1, name: "Catan", cost: 30000, level: 1, imageUrl: "https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017220100-1200-face3d.jpg" },
    { id: 2, name: "Carcassonne", cost: 30000, level: 1, imageUrl: "https://devirinvestments.s3.eu-west-1.amazonaws.com/img/catalog/product/8436017222593-1200-frontflat-copy.jpg" },
    { id: 8, name: "Mouse Logitech", cost: 40000, level: 2, imageUrl: "https://media.spdigital.cl/thumbnails/products/snbujg5__29f7dd61_thumbnail_4096.jpg" },
    { id: 9, name: "Mousepad Razer Goliathus Chroma", cost: 40000, level: 2, imageUrl: "https://cl-cenco-pim-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/3840x0/filters:quality(75)/prd-cl/product-medias/bb228f59-3aa1-4d9e-bbf4-b5f71bc89ca0/MK8YWFQA7I/MK8YWFQA7I-1/1737041557738-MK8YWFQA7I-1-1.jpg" },
    { id: 4, name: "Auriculares Gamer HyperX Cloud II", cost: 50000, level: 3, imageUrl: "https://row.hyperx.com/cdn/shop/files/hyperx_cloud_ii_red_1_main.jpg?v=1737720332" },
    { id: 3, name: "Controlador Inalámbrico Xbox Series X", cost: 50000, level: 3, imageUrl: "https://prophonechile.cl/wp-content/uploads/2023/11/purpleeee.png" },
    { id: 7, name: "Silla Gamer Secretlab Titan", cost: 100000, level: 4, imageUrl: "https://images.secretlab.co/turntable/tr:n-w_750/R22PU-Stealth_02.jpg" },
];

// 2. Define las categorías de Nivel
const levelCategories = ['Todos', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4'];

const RewardsPage = () => {
    const { user, refreshUser } = useAuth(); 
    const [message, setMessage] = useState('');
    
    // 3. Añade estado para el filtro activo
    const [activeFilter, setActiveFilter] = useState('Todos');

    // 4. Lógica de 'handleRedeem' (sin cambios)
    const handleRedeem = async (reward) => {
        setMessage('');
        if (!window.confirm(`¿Canjear ${reward.name} por ${reward.cost.toLocaleString('es-CL')} puntos?`)) return;
        try {
            await RewardsService.redeemReward(reward.id);
            await refreshUser(); 
            setMessage(`¡Has canjeado ${reward.name} con éxito!`);
        } catch (error) {
            setMessage("Error al canjear: " + (error.response?.data || error.message));
        }
    };

    // 5. 'useMemo' para filtrar las recompensas
    const filteredRewards = useMemo(() => {
        if (activeFilter === 'Todos') {
            return REWARDS; 
        }
        // Extrae el número del string (ej: "Nivel 1" -> 1)
        const level = parseInt(activeFilter.replace('Nivel ', ''));
        return REWARDS.filter(r => r.level === level);
    }, [activeFilter]);

    // 6. Guardia de Duoc (sin cambios)
    if (!user || user.userRole !== "ROLE_DUOC") {
        return (
            <div>
                <Header />
                <main className="container mt-4 rewards-page"> 
                    <p>Esta sección es solo para usuarios Duoc.</p>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="container mt-4 rewards-page">
                <h2>Tienda de Puntos Duoc</h2>
                
                <p className="points-display">
                    Puntos disponibles para gastar: <strong>{user.pointsBalance.toLocaleString('es-CL')} Pts.</strong>
                </p>
                
                {message && (
                    <div className="alert alert-info server-message">
                        {message}
                    </div>
                )}

                {/* --- 7. ¡NUEVA ESTRUCTURA DE LAYOUT! --- */}
                {/* (Clase copiada de tu ProductCatalog.css) */}
                <section className="catalog-section">

                    {/* Barra Lateral de Filtros */}
                    <aside className="filter-sidebar">
                        <h3 className="filter-title">Niveles</h3>
                        <ul>
                            {levelCategories.map(level => (
                                <li key={level}>
                                    <button 
                                        className={activeFilter === level ? 'active' : ''}
                                        onClick={() => setActiveFilter(level)}
                                        // Deshabilita el botón si el usuario no tiene el nivel
                                        disabled={user.userLevel < parseInt(level.replace('Nivel ', '') || 0)}
                                    >
                                        {level}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Cuadrícula de Recompensas (como tu catálogo) */}
                    <div className="product-grid"> 
                        {filteredRewards.map(reward => {
                            const canAfford = user.pointsBalance >= reward.cost;
                            const hasLevel = user.userLevel >= reward.level;
                            const canRedeem = canAfford && hasLevel;
                            
                            return (
                                <div className="product-card" key={reward.id} style={{ opacity: canRedeem ? 1 : 0.6 }}>
                                    
                                    <div className="product-image-link"> 
                                        <img src={reward.imageUrl} alt={reward.name} className="product-image" />
                                    </div>
            
                                    <div className="product-info">
                                        <span className="product-category">Nivel {reward.level} Requerido</span>
                                        <h4 className="product-name">{reward.name}</h4>
                                        <div className="product-footer">
                                            <p className="product-price">
                                                {reward.cost.toLocaleString('es-CL')} Pts.
                                            </p>
                                            <Button 
                                                className="redeem-button"
                                                onClick={() => handleRedeem(reward)}
                                                disabled={!canRedeem}
                                                variant="primary"
                                                size="sm"
                                            >
                                                {canRedeem ? "Canjear" : (hasLevel ? "Pts. insuf." : "Nivel insuf.")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div> {/* Fin de product-grid */}

                </section> {/* Fin de catalog-section */}

            </main>
        </div>
    );
};

export default RewardsPage;
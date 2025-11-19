import React, { useState, useEffect } from 'react';
import OrderService from '../../../services/OrderService';
import Button from '../../atoms/Button/Button';
import { Spinner, Table, Alert, Modal } from 'react-bootstrap'; // ¡Importamos Modal!

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para el Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await OrderService.getMyOrders();
            // Ordenamos por fecha descendente
            const sortedOrders = response.data.sort((a, b) => 
                new Date(b.orderDate) - new Date(a.orderDate)
            );
            setOrders(sortedOrders);
        } catch (err) {
            console.error("Error obteniendo órdenes", err);
            setError("No pudimos cargar tu historial. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Funciones para abrir/cerrar el modal
    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="info" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="order-history-container">
            <h2>Historial de Compras</h2>
            
            {orders.length === 0 ? (
                <div className="text-center p-5 text-white">
                    <h3>Aún no has realizado compras.</h3>
                </div>
            ) : (
                <div className="table-responsive">
                    <Table hover variant="dark" className="orders-table">
                        <thead>
                            <tr>
                                <th># Orden</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Puntos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.id}>
                                    {/* NÚMERO PERSONALIZADO */}
                                    <td>
                                        <span className="fs-5 fw-bold">#{orders.length - index}</span>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            ID: {order.id}
                                        </div>
                                    </td>
                                    
                                    <td>
                                        {new Date(order.orderDate).toLocaleDateString()} <br/>
                                        <small className="text-muted">
                                            {new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </small>
                                    </td>
                                    
                                    <td className="text-success fw-bold align-middle">
                                        ${order.finalPrice.toLocaleString('es-CL')}
                                    </td>
                                    
                                    <td className="text-info align-middle">
                                        +{order.pointsEarned} XP
                                    </td>
                                    
                                    <td className="align-middle">
                                        <Button 
                                            size="sm" 
                                            variant="outline-light" 
                                            onClick={() => handleShowDetails(order)}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* --- MODAL DE DETALLES --- */}
            <Modal 
                show={showModal} 
                onHide={handleCloseModal} 
                size="lg" 
                centered
                contentClassName="bg-dark text-white border-secondary" // Estilo oscuro para el modal
            >
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title>
                        Detalle de Orden #{selectedOrder?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <div className="mb-3">
                                <p><strong>Fecha:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                                <p><strong>Total Pagado:</strong> ${selectedOrder.finalPrice.toLocaleString('es-CL')}</p>
                            </div>

                            <Table striped bordered hover variant="dark" size="sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th className="text-center">Cant.</th>
                                        <th className="text-end">Precio Unit.</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                {/* Si tienes imagen en el producto, podrías mostrarla aquí */}
                                                <span className="fw-bold">{item.product.name}</span>
                                            </td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">
                                                ${item.priceAtPurchase.toLocaleString('es-CL')}
                                            </td>
                                            <td className="text-end text-info">
                                                ${(item.priceAtPurchase * item.quantity).toLocaleString('es-CL')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button onClick={handleCloseModal} variant="secondary">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderHistory;
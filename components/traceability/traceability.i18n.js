

window.TRACEABILITY_EVENTS = {
  "es": [
    {
      "t": "Preparado en almacén",
      "d": "El envío se acondicionó a 4 °C y se asignó el SmartBox SB-0182.",
      "time": "08:10",
      "loc": "Almacén Lima",
      "temp": "4.0 °C"
    },
    {
      "t": "Recogido por el vehículo",
      "d": "Carga verificada: 18.4 kg. Puerta cerrada y precintada al salir.",
      "time": "08:42",
      "loc": "Almacén Lima",
      "temp": "4.1 °C"
    },
    {
      "t": "En tránsito",
      "d": "Salida a Panamericana Sur. Lecturas cada 60 segundos desde el SmartBox.",
      "time": "10:05",
      "loc": "Km 312",
      "temp": "4.2 °C"
    },
    {
      "t": "Llegando a Arequipa",
      "d": "El vehículo entró al perímetro de destino. Se notificó al centro receptor.",
      "time": "14:12",
      "loc": "Arequipa",
      "temp": "4.4 °C"
    },
    {
      "t": "Entrega pendiente",
      "d": "A la espera de la confirmación del receptor para cerrar el historial.",
      "time": "14:35",
      "loc": "Arequipa",
      "temp": "—"
    }
  ],
  "en": [
    {
      "t": "Prepared at the warehouse",
      "d": "The shipment was conditioned to 4 °C and SmartBox SB-0182 was assigned.",
      "time": "08:10",
      "loc": "Lima warehouse",
      "temp": "4.0 °C"
    },
    {
      "t": "Picked up by the vehicle",
      "d": "Load verified: 18.4 kg. Door closed and sealed on departure.",
      "time": "08:42",
      "loc": "Lima warehouse",
      "temp": "4.1 °C"
    },
    {
      "t": "In transit",
      "d": "Departed onto Panamericana Sur. Readings every 60 seconds from the SmartBox.",
      "time": "10:05",
      "loc": "Km 312",
      "temp": "4.2 °C"
    },
    {
      "t": "Arriving in Arequipa",
      "d": "The vehicle entered the destination perimeter. The receiving centre was notified.",
      "time": "14:12",
      "loc": "Arequipa",
      "temp": "4.4 °C"
    },
    {
      "t": "Delivery pending",
      "d": "Waiting for the receiver's confirmation to close the record.",
      "time": "14:35",
      "loc": "Arequipa",
      "temp": "—"
    }
  ]
};

window.registerI18n && window.registerI18n({
  es: {
    "tr.kicker": "Trazabilidad",
    "tr.title": "Cada transporte deja un registro completo.",
    "tr.lead": "Desde la preparación hasta la firma de entrega, cada evento queda registrado con hora, ubicación y condiciones. Selecciona un hito para ver el detalle.",
    "tr.events": "5 eventos registrados",
    "tr.s1": "Preparado",
    "tr.s2": "Recogido",
    "tr.s3": "En tránsito",
    "tr.s4": "Llegando",
    "tr.s5": "Entregado",
    "tr.f1": "Temperatura máxima",
    "tr.f2": "Aperturas de puerta",
    "tr.f3": "Tiempo en ruta",
    "tr.f4": "Alertas"
},
  en: {
    "tr.kicker": "Traceability",
    "tr.title": "Every transport leaves a complete record.",
    "tr.lead": "From preparation to the delivery signature, each event is recorded with time, location and conditions. Select a milestone to see the details.",
    "tr.events": "5 events recorded",
    "tr.s1": "Prepared",
    "tr.s2": "Picked up",
    "tr.s3": "In transit",
    "tr.s4": "Arriving",
    "tr.s5": "Delivered",
    "tr.f1": "Peak temperature",
    "tr.f2": "Door openings",
    "tr.f3": "Time en route",
    "tr.f4": "Alerts"
}
});

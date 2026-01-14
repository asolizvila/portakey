
import React from 'react';

export interface DeliveryLog {
  id: string;
  time: string;
  carrier: string;
  status: 'Entregado' | 'En camino' | 'Cancelado';
  packageId: string;
}

export enum View {
  HOME = 'home',
  SPECS = 'specs',
  LAB = 'lab',
  DASHBOARD = 'dashboard'
}

export enum SimulationState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  VERIFYING = 'VERIFYING',
  OPENING = 'OPENING',
  DELIVERED = 'DELIVERED'
}

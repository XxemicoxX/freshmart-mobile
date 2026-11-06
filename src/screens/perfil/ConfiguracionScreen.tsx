import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { guardarConfiguracion, obtenerConfiguracion } from '../../api/usuario';
import Cargando from '../../components/Cargando';
import MensajeVacio from '../../components/MensajeVacio';
import Pantalla, { Seccion } from '../../components/Pantalla';
import { colores } from '../../theme/colores';
import { Configuracion } from '../../types';

export default function ConfiguracionScreen() {
  const [cfg, setCfg] = useState<Configuracion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { obtenerConfiguracion().then(setCfg).catch((e) => setError(e.message)); }, []);

  const cambiar = async (cambio: Partial<Configuracion>) => {
    if (!cfg) return;
    const anterior = cfg;
    const nueva = { ...cfg, ...cambio };
    setCfg(nueva);
    try { setCfg(await guardarConfiguracion(nueva)); } catch (e: any) { setCfg(anterior); setError(e.message); }
  };

  if (error && !cfg) return <MensajeVacio icono="cloud-offline-outline" titulo="No se pudo cargar la configuración" detalle={error} />;
  if (!cfg) return <Cargando />;

  const Fila = ({ texto, valor, campo }: { texto: string; valor: boolean; campo: 'notifPedidos' | 'notifPromociones' | 'notifCorreo' }) => (
    <View style={styles.fila}>
      <Text style={styles.texto}>{texto}</Text>
      <Switch value={valor} onValueChange={(v) => cambiar({ [campo]: v })} trackColor={{ true: colores.primario }} />
    </View>
  );

  return (
    <Pantalla>
      <Seccion>
        <Fila texto="Avisos de mis pedidos" valor={cfg.notifPedidos} campo="notifPedidos" />
        <Fila texto="Promociones y ofertas" valor={cfg.notifPromociones} campo="notifPromociones" />
        <Fila texto="Recibir avisos por correo" valor={cfg.notifCorreo} campo="notifCorreo" />
      </Seccion>
      <Seccion>
        <View style={styles.fila}>
          <Text style={styles.texto}>Tema oscuro (guardado en tu cuenta)</Text>
          <Switch value={cfg.tema === 'OSCURO'} onValueChange={(v) => cambiar({ tema: v ? 'OSCURO' : 'CLARO' })} trackColor={{ true: colores.primario }} />
        </View>
      </Seccion>
      {error ? <Text style={{ color: colores.error }}>{error}</Text> : null}
    </Pantalla>
  );
}
const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  texto: { flex: 1, fontSize: 15, color: colores.texto, paddingRight: 12 },
});

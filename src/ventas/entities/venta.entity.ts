import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetalleVentas } from "../../detalle_ventas/entities/detalle_ventas.entity";
import { EstadoVenta, MetodoPago } from "../enums/ventas.enums";
import { Usuarios } from "../../usuarios/entities/usuarios.entity";

@Entity()
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.compras)
  usuario: Usuarios | null

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  fecha: Date

  @Column({ type: 'int', nullable: false })
  total: number

  @Column({
    type: 'enum',
    enum: MetodoPago,
  })
  metodoPago: MetodoPago;

  @Column({
    type: 'enum',
    enum: EstadoVenta,
    default: EstadoVenta.PENDIENTE_PAGO
  })
  estado: EstadoVenta;

  @OneToMany(() => DetalleVentas, (detalle) => detalle.venta, {cascade: true})
  detalle_venta: DetalleVentas[]



  @Column({ type: 'varchar', length: 100, nullable: true })
  nombreClienteCasual: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellidoClienteCasual: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  emailClienteCasual: string | null;
}

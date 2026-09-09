import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "../../ventas/entities/venta.entity";
import { Productos } from "../../productos/entities/producto.entity";
import { Variantes } from "../../variantes/entities/variantes.entity";

@Entity()
export class DetalleVentas {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'int', nullable: false })
    cantidad: number

    @Column({ type: 'int', nullable: false })
    precio: number

    @ManyToOne(() => Productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productoId' }) 
    producto: Productos;                

    @ManyToOne(() => Variantes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'varianteId' }) 
    variante: Variantes;

    @ManyToOne(() => Venta, (venta) => venta.detalle_venta, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ventaId' }) 
    venta: Venta;
}

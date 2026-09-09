import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Productos } from "../../productos/entities/producto.entity";

@Entity()
export class Variantes {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'int', nullable: false})
    stock: number

    @Column({type: 'varchar', nullable: false})
    mililitros: string

    @Column({type: 'int', nullable: false})
    precio: number

    @ManyToOne(()=> Productos, (prod)=> prod.variantes,  { onDelete: 'CASCADE' })
    producto: Productos
}

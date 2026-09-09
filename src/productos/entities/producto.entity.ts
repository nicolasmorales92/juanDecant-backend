import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GeneroEnum } from "../enum´s/genero.enum";
import { Variantes } from "../../variantes/entities/variantes.entity";

@Entity()
export class Productos {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'varchar', nullable: false})
    nombre: string

    @Column({type: 'varchar', nullable: false})
    marca: string

    @Column({type: 'enum', nullable: false, enum: GeneroEnum})
    genero: GeneroEnum

    @Column({type: 'varchar', nullable: true, array: true})
    imagenes: string[]

    @Column({type: 'varchar', nullable: false})
    descripcion: string

    @OneToMany(()=> Variantes, (variante)=>variante.producto, {cascade: true, onDelete: 'CASCADE'}) 
    variantes: Variantes[]
}

import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProvinciasEnum } from "../enums/provincias.enum";
import { RolesEnum } from "../enums/roles.enum";
import { Venta } from "../../ventas/entities/venta.entity";
import { TodasLasCiudadesEnum } from "../enums/todasLasCiudades.enum";

@Entity()
export class Usuarios {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', nullable: true, length: 20 })
    nombre: string

    @Column({ type: 'varchar', nullable: true, length: 20 })
    apellido: string

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string

    @Column({ type: 'varchar', nullable: false })
    password: string

    @Column({ type: 'enum', enum: ProvinciasEnum, nullable: false })
    provincia: ProvinciasEnum

    @Column({ type: 'enum', enum: TodasLasCiudadesEnum, nullable: false })
    ciudad: TodasLasCiudadesEnum

    @Column({ type: 'varchar', nullable: true })
    calle: string;

    @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USUARIO })
    rol: RolesEnum

    @Column({ type: 'boolean', default: false })
    estaVerificado: boolean;

    @OneToMany(() => Venta, (venta) => venta.usuario)
    compras: Venta[]
}

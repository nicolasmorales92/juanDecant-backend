import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Variantes } from "./entities/variantes.entity";

@Injectable()
export class VariantesRepository{
    constructor(
        @InjectRepository(Variantes)
        private readonly variantesRepository: Repository<Variantes>
    ){}    
    
    
    async buscarPorNombre(nombre: string){
            return await this.variantesRepository.find({
                where: {
                    
                },
                relations: {
                    producto: true
                },
                take: 8
            })
        }


}

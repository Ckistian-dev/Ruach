import { motion } from "framer-motion";
import { MapPin, Instagram, Clock, Phone } from "lucide-react";

export default function Contato() {
  return (
    <section className="px-6 md:px-24 py-24 bg-gradient-to-b from-white to-gray-100">
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-2">
          Precisa de <span className="text-red-600">Ajuda?</span>
        </h2>
        <p className="text-gray-500 text-lg">Fale conosco agora mesmo</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto items-center">
        
        {/* Mapa */}
        <motion.div
          className="rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7484057221554!2d-53.7764404!3d-24.7011741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3970d2c60f623%3A0x6513d79d542d3b63!2sSorveteria%20Summer%20Ice!5e0!3m2!1spt-BR!2sbr!4v1745781431605!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            allowFullScreen=""
            className="w-full h-96 border-0"
          ></iframe>
        </motion.div>

        {/* Informações */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col gap-8"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            <Phone className="text-red-600" />
            <div>
              <h4 className="text-red-600 font-bold text-sm">WHATSAPP</h4>
              <p className="font-bold text-lg">(45) 99101-0879</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Instagram className="text-red-600" />
            <div>
              <h4 className="text-red-600 font-bold text-sm">INSTAGRAM</h4>
              <p className="font-bold text-lg">@ruachtoledo</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="text-red-600" />
            <div>
              <h4 className="text-red-600 font-bold text-sm">VISITE-NOS</h4>
              <p className="font-bold text-lg">
                Rua Angela Zanella 147, Coapagro - Toledo, PR
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-red-600 mt-1" />
            <div>
              <h4 className="text-red-600 font-bold text-sm">ATENDIMENTO</h4>
              <p className="text-lg font-bold leading-6">
                Dom: 14:00 – 22:00<br />
                Seg: 17:00 – 22:00<br />
                Ter: FECHADO<br />
                Qua: 17:00 – 22:00<br />
                Qui: 17:00 – 22:00<br />
                Sex: 17:00 – 22:00<br />
                Sáb: 17:00 – 22:00
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

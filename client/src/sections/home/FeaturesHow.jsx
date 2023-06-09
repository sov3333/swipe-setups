import { motion } from 'framer-motion';

import styles from '../../styles';
import { staggerContainer, fadeIn } from '../../utils/motion';
import { FeaturesList, TitleText, TypingText } from '../../components/home';
import { featuresHow } from '../../constants';
import { setup_iso_1 } from '../../assets/home';

const FeaturesHow = () => (
  <section className={`${styles.paddings} relative z-10`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: 'false', amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex lg:flex-row flex-col gap-8`}
    >
      <motion.div
        variants={fadeIn('right', 'tween', 0.2, 1)}
        className={`flex-1 ${styles.flexCenter}`}

      >
        <img src={setup_iso_1} alt="desk setup isometric" className="w-[90%] h-[90%] object-contain" />
      </motion.div>
      <motion.div
        variants={fadeIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] flex justify-center flex-col"
      >
        <TypingText title="| How It Works" />
        <TitleText title={<>Tinder for computer equipment</>} />
        <div className="mt-[31px] flex flex-col max-w-[370px] gap-[24px]">
          {featuresHow.map((feature, index) => (
            <FeaturesList
              key={feature}
              number={index + 1}
              text={feature}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  </section>
);

export default FeaturesHow;

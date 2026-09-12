import React from 'react'
import Container from './layouts/Container'
import Truck from '../assets/svg/Truck'
import Headphone from '../assets/svg/Headphone'
import Bag from '../assets/svg/Bag'
import Package from '../assets/svg/Package'
import { useTranslation } from 'react-i18next'

const StoreBenefits = () => {
    const { t } = useTranslation();

    return (
        <Container className='pb-6 lg:pb-10'>
            {/* Desktop: flex-row, py-10 px-10. Mobile: 2-column grid (grid-cols-2) with compact padding */}
            <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-between gap-3 sm:gap-6 lg:gap-0 bg-white rounded-xl lg:rounded-lg shadow-[0px_8px_40px_0px_rgba(0,38,3,0.08)] p-4 sm:p-6 lg:py-10 lg:px-10">
                
                {/* Item 1 */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-x-4 p-1 lg:p-0">
                    <div className="shrink-0 scale-[0.75] lg:scale-100">
                        <Truck />
                    </div>
                    <div>
                        <h4 className='font-pop font-semibold text-[11px] sm:text-[13px] lg:text-base text-logoc leading-[120%] lg:pb-2'>{t('store_benefits.free_shipping.title')}</h4>
                        <p className='text-[9px] sm:text-[11px] lg:defaultfs text-grynine mt-0.5 lg:mt-0 leading-[130%] lg:leading-normal'>{t('store_benefits.free_shipping.desc')}</p>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-x-4 p-1 lg:p-0">
                    <div className="shrink-0 scale-[0.75] lg:scale-100">
                        <Headphone />
                    </div>
                    <div>
                        <h4 className='font-pop font-semibold text-[11px] sm:text-[13px] lg:text-base text-logoc leading-[120%] lg:pb-2'>{t('store_benefits.support.title')}</h4>
                        <p className='text-[9px] sm:text-[11px] lg:defaultfs text-grynine mt-0.5 lg:mt-0 leading-[130%] lg:leading-normal'>{t('store_benefits.support.desc')}</p>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-x-4 p-1 lg:p-0">
                    <div className="shrink-0 scale-[0.75] lg:scale-100">
                        <Bag />
                    </div>
                    <div>
                        <h4 className='font-pop font-semibold text-[11px] sm:text-[13px] lg:text-base text-logoc leading-[120%] lg:pb-2'>{t('store_benefits.secure_payment.title')}</h4>
                        <p className='text-[9px] sm:text-[11px] lg:defaultfs text-grynine mt-0.5 lg:mt-0 leading-[130%] lg:leading-normal'>{t('store_benefits.secure_payment.desc')}</p>
                    </div>
                </div>

                {/* Item 4 */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-1.5 lg:gap-x-4 p-1 lg:p-0">
                    <div className="shrink-0 scale-[0.75] lg:scale-100">
                        <Package />
                    </div>
                    <div>
                        <h4 className='font-pop font-semibold text-[11px] sm:text-[13px] lg:text-base text-logoc leading-[120%] lg:pb-2'>{t('store_benefits.money_back.title')}</h4>
                        <p className='text-[9px] sm:text-[11px] lg:defaultfs text-grynine mt-0.5 lg:mt-0 leading-[130%] lg:leading-normal'>{t('store_benefits.money_back.desc')}</p>
                    </div>
                </div>

            </div>
        </Container>
    )
}

export default StoreBenefits;
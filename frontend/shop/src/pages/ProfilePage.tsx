import { useState } from 'react';
import { User, MapPin, CreditCard, Trash2, Plus, AlertTriangle, Banknote, QrCode } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { PaymentType } from '@/types';
import { cn } from '@/utils/cn';
import toast from 'react-hot-toast';

type ProfileSection = 'personal' | 'address' | 'payment';

export function ProfilePage() {
  const { isDark } = useThemeStore();
  const { user, logout } = useAuthStore();
  const {
    addresses,
    paymentMethods,
    personalInfo,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    updatePersonalInfo,
  } = useProfileStore();

  const [activeSection, setActiveSection] = useState<ProfileSection>('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    isDefault: false,
  });

  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>('credit_card');
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    pixKey: '',
    isDefault: false,
  });

  const handleDeleteAccount = () => {
    if (deleteConfirmed) {
      logout();
      toast.success('Conta excluída com sucesso');
    }
  };

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.street && newAddress.city) {
      addAddress(newAddress);
      setNewAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        isDefault: false,
      });
      setShowAddAddressModal(false);
      toast.success('Endereço adicionado com sucesso');
    }
  };

  const handleAddPayment = () => {
    if (selectedPaymentType === 'credit_card') {
      if (newPayment.cardNumber && newPayment.cardHolder && newPayment.expiryDate) {
        const maskedCard = `**** **** **** ${newPayment.cardNumber.slice(-4)}`;
        addPaymentMethod({
          type: 'credit_card',
          cardNumber: maskedCard,
          cardHolder: newPayment.cardHolder,
          expiryDate: newPayment.expiryDate,
          displayName: `Cartão de Crédito •••• ${newPayment.cardNumber.slice(-4)}`,
          isDefault: newPayment.isDefault,
        });
        toast.success('Cartão adicionado com sucesso');
      } else {
        toast.error('Preencha todos os campos do cartão');
        return;
      }
    } else if (selectedPaymentType === 'pix') {
      if (newPayment.pixKey) {
        addPaymentMethod({
          type: 'pix',
          pixKey: newPayment.pixKey,
          displayName: `PIX - ${newPayment.pixKey}`,
          isDefault: newPayment.isDefault,
        });
        toast.success('Chave PIX adicionada com sucesso');
      } else {
        toast.error('Informe a chave PIX');
        return;
      }
    } else if (selectedPaymentType === 'cash') {
      addPaymentMethod({
        type: 'cash',
        displayName: 'Dinheiro na Entrega',
        isDefault: newPayment.isDefault,
      });
      toast.success('Forma de pagamento adicionada');
    }

    setNewPayment({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      pixKey: '',
      isDefault: false,
    });
    setShowAddPaymentModal(false);
  };

  const getPaymentIcon = (type: PaymentType) => {
    switch (type) {
      case 'credit_card':
        return CreditCard;
      case 'pix':
        return QrCode;
      case 'cash':
        return Banknote;
      default:
        return CreditCard;
    }
  };

  const navItems = [
    { id: 'personal', label: 'Pessoal', icon: User },
    { id: 'address', label: 'Endereços', icon: MapPin },
    { id: 'payment', label: 'Formas de Pagamento', icon: CreditCard },
  ];

  return (
    <div className={cn(
      'min-h-screen py-8',
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={cn(
          'text-3xl font-bold mb-8',
          isDark ? 'text-white' : 'text-gray-900'
        )}>
          Meu Perfil
        </h1>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Left Navigation */}
          <div className={cn(
            'md:col-span-1 rounded-xl p-4 h-fit',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ProfileSection)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                    activeSection === item.id
                      ? 'bg-indigo-600 text-white'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className={cn(
            'md:col-span-3 rounded-xl p-6',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            {/* Personal Section */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <h2 className={cn(
                  'text-xl font-semibold',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Informações Pessoais
                </h2>

                <div className="grid gap-4">
                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={personalInfo.name || user?.name || ''}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg border',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      )}
                    />
                  </div>

                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email || user?.email || ''}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg border',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      )}
                    />
                  </div>

                  <div>
                    <label className={cn(
                      'block text-sm font-medium mb-2',
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className={cn(
                        'w-full px-4 py-3 rounded-lg border',
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Perfil atualizado com sucesso')}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Salvar Alterações
                </button>

                <div className={cn(
                  'mt-8 pt-8 border-t',
                  isDark ? 'border-gray-700' : 'border-gray-200'
                )}>
                  <h3 className="text-lg font-semibold text-red-500 mb-4">
                    Zona de Perigo
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Excluir Minha Conta</span>
                  </button>
                </div>
              </div>
            )}

            {/* Address Section */}
            {activeSection === 'address' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className={cn(
                    'text-xl font-semibold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    Endereços de Entrega
                  </h2>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Endereço</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={cn(
                        'p-4 rounded-lg border relative',
                        address.isDefault
                          ? 'border-indigo-500'
                          : isDark ? 'border-gray-700' : 'border-gray-200'
                      )}
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          Padrão
                        </span>
                      )}
                      <h4 className={cn(
                        'font-medium',
                        isDark ? 'text-white' : 'text-gray-900'
                      )}>
                        {address.name}
                      </h4>
                      <p className={cn(
                        'text-sm mt-1',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        {!address.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(address.id)}
                            className={cn(
                              'text-sm px-3 py-1 rounded transition-colors',
                              isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            )}
                          >
                            Definir como Padrão
                          </button>
                        )}
                        <button
                          onClick={() => {
                            removeAddress(address.id);
                            toast.success('Endereço removido');
                          }}
                          className="text-sm px-3 py-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Section */}
            {activeSection === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className={cn(
                    'text-xl font-semibold',
                    isDark ? 'text-white' : 'text-gray-900'
                  )}>
                    Formas de Pagamento
                  </h2>
                  <button
                    onClick={() => setShowAddPaymentModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = getPaymentIcon(method.type);
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          'p-4 rounded-lg border relative',
                          method.isDefault
                            ? 'border-indigo-500'
                            : isDark ? 'border-gray-700' : 'border-gray-200'
                        )}
                      >
                        {method.isDefault && (
                          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                            Padrão
                          </span>
                        )}
                        <div className="flex items-center space-x-3">
                          <Icon className={cn(
                            'h-8 w-8',
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          )} />
                          <div>
                            <p className={cn(
                              'font-medium',
                              isDark ? 'text-white' : 'text-gray-900'
                            )}>
                              {method.displayName}
                            </p>
                            {method.type === 'credit_card' && method.cardHolder && (
                              <p className={cn(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              )}>
                                {method.cardHolder} • Expira em {method.expiryDate}
                              </p>
                            )}
                            {method.type === 'pix' && (
                              <p className={cn(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              )}>
                                Transferência instantânea via PIX
                              </p>
                            )}
                            {method.type === 'cash' && (
                              <p className={cn(
                                'text-sm',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              )}>
                                Pagamento em dinheiro no momento da entrega
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          {!method.isDefault && (
                            <button
                              onClick={() => setDefaultPaymentMethod(method.id)}
                              className={cn(
                                'text-sm px-3 py-1 rounded transition-colors',
                                isDark
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              )}
                            >
                              Definir como Padrão
                            </button>
                          )}
                          <button
                            onClick={() => {
                              removePaymentMethod(method.id);
                              toast.success('Forma de pagamento removida');
                            }}
                            className="text-sm px-3 py-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmed(false);
            }}
          />
          <div className={cn(
            'relative w-full max-w-md rounded-xl p-6',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className={cn(
                'text-lg font-semibold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Excluir Conta
              </h3>
            </div>
            <p className={cn(
              'mb-4',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}>
              Tem certeza que deseja excluir sua conta? Esta ação é irreversível.
            </p>
            <label className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                checked={deleteConfirmed}
                onChange={(e) => setDeleteConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className={cn(
                'text-sm',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                Eu entendo que todas as minhas informações serão permanentemente excluídas.
              </span>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmed(false);
                }}
                className={cn(
                  'flex-1 py-2 rounded-lg transition-colors',
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!deleteConfirmed}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddAddressModal(false)}
          />
          <div className={cn(
            'relative w-full max-w-md rounded-xl p-6',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <h3 className={cn(
              'text-lg font-semibold mb-4',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Adicionar Novo Endereço
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do endereço (ex: Casa, Trabalho)"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border',
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
              />
              <input
                type="text"
                placeholder="Rua e número"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border',
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border',
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />
                <input
                  type="text"
                  placeholder="Estado"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border',
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="CEP"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border',
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />
                <input
                  type="text"
                  placeholder="País"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border',
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Definir como endereço padrão
                </span>
              </label>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddAddressModal(false)}
                className={cn(
                  'flex-1 py-2 rounded-lg transition-colors',
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddAddress}
                className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Adicionar Endereço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddPaymentModal(false)}
          />
          <div className={cn(
            'relative w-full max-w-md rounded-xl p-6',
            isDark ? 'bg-gray-800' : 'bg-white'
          )}>
            <h3 className={cn(
              'text-lg font-semibold mb-4',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Adicionar Forma de Pagamento
            </h3>
            
            {/* Payment Type Selection */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setSelectedPaymentType('credit_card')}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg border transition-colors',
                  selectedPaymentType === 'credit_card'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isDark
                      ? 'border-gray-600 text-gray-300 hover:border-indigo-500'
                      : 'border-gray-300 text-gray-700 hover:border-indigo-500'
                )}
              >
                <CreditCard className="h-5 w-5" />
                <span>Cartão</span>
              </button>
              <button
                onClick={() => setSelectedPaymentType('pix')}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg border transition-colors',
                  selectedPaymentType === 'pix'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isDark
                      ? 'border-gray-600 text-gray-300 hover:border-indigo-500'
                      : 'border-gray-300 text-gray-700 hover:border-indigo-500'
                )}
              >
                <QrCode className="h-5 w-5" />
                <span>PIX</span>
              </button>
              <button
                onClick={() => setSelectedPaymentType('cash')}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg border transition-colors',
                  selectedPaymentType === 'cash'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isDark
                      ? 'border-gray-600 text-gray-300 hover:border-indigo-500'
                      : 'border-gray-300 text-gray-700 hover:border-indigo-500'
                )}
              >
                <Banknote className="h-5 w-5" />
                <span>Dinheiro</span>
              </button>
            </div>

            <div className="space-y-4">
              {selectedPaymentType === 'credit_card' && (
                <>
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    value={newPayment.cardNumber}
                    onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg border',
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Nome no Cartão"
                    value={newPayment.cardHolder}
                    onChange={(e) => setNewPayment({ ...newPayment, cardHolder: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg border',
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                  />
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    value={newPayment.expiryDate}
                    onChange={(e) => setNewPayment({ ...newPayment, expiryDate: e.target.value })}
                    className={cn(
                      'w-full px-4 py-2 rounded-lg border',
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    )}
                  />
                </>
              )}

              {selectedPaymentType === 'pix' && (
                <input
                  type="text"
                  placeholder="Chave PIX (CPF, E-mail, Telefone ou Aleatória)"
                  value={newPayment.pixKey}
                  onChange={(e) => setNewPayment({ ...newPayment, pixKey: e.target.value })}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg border',
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                />
              )}

              {selectedPaymentType === 'cash' && (
                <p className={cn(
                  'text-sm p-4 rounded-lg',
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                )}>
                  O pagamento será realizado em dinheiro no momento da entrega. Certifique-se de ter o valor exato ou troco disponível.
                </p>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newPayment.isDefault}
                  onChange={(e) => setNewPayment({ ...newPayment, isDefault: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Definir como forma de pagamento padrão
                </span>
              </label>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className={cn(
                  'flex-1 py-2 rounded-lg transition-colors',
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                )}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPayment}
                className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

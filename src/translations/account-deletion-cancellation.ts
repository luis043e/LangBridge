import type {
    AppLanguage,
} from '../translations';

export type AccountDeletionCancellationNavigationText = {
  checkingRequest:
    string;
  requestUnavailableTitle:
    string;
  requestUnavailableMessage:
    string;
  pointOfNoReturnTitle:
    string;
  pointOfNoReturnMessage:
    string;
  notCancellableTitle:
    string;
  notCancellableMessage:
    string;
  stateErrorTitle:
    string;
  stateErrorMessage:
    string;
};

export const accountDeletionCancellationNavigationText =
  {
    en: {
      checkingRequest:
        'Checking request...',
      requestUnavailableTitle:
        'Could not check the request',
      requestUnavailableMessage:
        'Check your connection and try again.',
      pointOfNoReturnTitle:
        'Cancellation is no longer available',
      pointOfNoReturnMessage:
        'An irreversible deletion operation has already started.',
      notCancellableTitle:
        'Request cannot be cancelled',
      notCancellableMessage:
        'This deletion request is not currently eligible for cancellation.',
      stateErrorTitle:
        'Could not verify the request',
      stateErrorMessage:
        'The request status could not be verified safely. Try again later.',
    },

    es: {
      checkingRequest:
        'Comprobando solicitud...',
      requestUnavailableTitle:
        'No se pudo comprobar la solicitud',
      requestUnavailableMessage:
        'Revisa tu conexión e inténtalo nuevamente.',
      pointOfNoReturnTitle:
        'La cancelación ya no está disponible',
      pointOfNoReturnMessage:
        'Ya comenzó una operación irreversible de eliminación.',
      notCancellableTitle:
        'La solicitud no se puede cancelar',
      notCancellableMessage:
        'Esta solicitud de eliminación no cumple actualmente las condiciones para cancelarse.',
      stateErrorTitle:
        'No se pudo verificar la solicitud',
      stateErrorMessage:
        'El estado de la solicitud no pudo verificarse de forma segura. Inténtalo más tarde.',
    },

    fr: {
      checkingRequest:
        'Vérification de la demande...',
      requestUnavailableTitle:
        'Impossible de vérifier la demande',
      requestUnavailableMessage:
        'Vérifiez votre connexion et réessayez.',
      pointOfNoReturnTitle:
        "L’annulation n’est plus disponible",
      pointOfNoReturnMessage:
        'Une opération de suppression irréversible a déjà commencé.',
      notCancellableTitle:
        'La demande ne peut pas être annulée',
      notCancellableMessage:
        "Cette demande de suppression ne peut pas être annulée actuellement.",
      stateErrorTitle:
        'Impossible de vérifier la demande',
      stateErrorMessage:
        "L’état de la demande n’a pas pu être vérifié en toute sécurité. Réessayez plus tard.",
    },

    pt: {
      checkingRequest:
        'Verificando a solicitação...',
      requestUnavailableTitle:
        'Não foi possível verificar a solicitação',
      requestUnavailableMessage:
        'Verifique sua conexão e tente novamente.',
      pointOfNoReturnTitle:
        'O cancelamento não está mais disponível',
      pointOfNoReturnMessage:
        'Uma operação de exclusão irreversível já foi iniciada.',
      notCancellableTitle:
        'A solicitação não pode ser cancelada',
      notCancellableMessage:
        'Esta solicitação de exclusão não pode ser cancelada no momento.',
      stateErrorTitle:
        'Não foi possível verificar a solicitação',
      stateErrorMessage:
        'O estado da solicitação não pôde ser verificado com segurança. Tente novamente mais tarde.',
    },

    de: {
      checkingRequest:
        'Anfrage wird geprüft...',
      requestUnavailableTitle:
        'Die Anfrage konnte nicht geprüft werden',
      requestUnavailableMessage:
        'Überprüfe deine Verbindung und versuche es erneut.',
      pointOfNoReturnTitle:
        'Eine Stornierung ist nicht mehr möglich',
      pointOfNoReturnMessage:
        'Ein unwiderruflicher Löschvorgang wurde bereits gestartet.',
      notCancellableTitle:
        'Die Anfrage kann nicht storniert werden',
      notCancellableMessage:
        'Diese Löschanfrage kann derzeit nicht storniert werden.',
      stateErrorTitle:
        'Die Anfrage konnte nicht verifiziert werden',
      stateErrorMessage:
        'Der Status der Anfrage konnte nicht sicher verifiziert werden. Versuche es später erneut.',
    },

    it: {
      checkingRequest:
        'Verifica della richiesta...',
      requestUnavailableTitle:
        'Impossibile verificare la richiesta',
      requestUnavailableMessage:
        'Controlla la connessione e riprova.',
      pointOfNoReturnTitle:
        'La cancellazione non è più disponibile',
      pointOfNoReturnMessage:
        'È già iniziata un’operazione di eliminazione irreversibile.',
      notCancellableTitle:
        'La richiesta non può essere annullata',
      notCancellableMessage:
        'Questa richiesta di eliminazione non può essere annullata al momento.',
      stateErrorTitle:
        'Impossibile verificare la richiesta',
      stateErrorMessage:
        'Lo stato della richiesta non può essere verificato in modo sicuro. Riprova più tardi.',
    },

    ja: {
      checkingRequest:
        'リクエストを確認しています...',
      requestUnavailableTitle:
        'リクエストを確認できませんでした',
      requestUnavailableMessage:
        '接続を確認して、もう一度お試しください。',
      pointOfNoReturnTitle:
        'キャンセルできません',
      pointOfNoReturnMessage:
        '取り消すことのできない削除処理がすでに開始されています。',
      notCancellableTitle:
        'リクエストをキャンセルできません',
      notCancellableMessage:
        'この削除リクエストは現在キャンセルできません。',
      stateErrorTitle:
        'リクエストを検証できませんでした',
      stateErrorMessage:
        'リクエストの状態を安全に検証できませんでした。後でもう一度お試しください。',
    },

    ko: {
      checkingRequest:
        '요청을 확인하는 중...',
      requestUnavailableTitle:
        '요청을 확인할 수 없습니다',
      requestUnavailableMessage:
        '연결을 확인한 후 다시 시도하세요.',
      pointOfNoReturnTitle:
        '더 이상 취소할 수 없습니다',
      pointOfNoReturnMessage:
        '되돌릴 수 없는 삭제 작업이 이미 시작되었습니다.',
      notCancellableTitle:
        '요청을 취소할 수 없습니다',
      notCancellableMessage:
        '현재 이 삭제 요청은 취소할 수 없습니다.',
      stateErrorTitle:
        '요청을 확인할 수 없습니다',
      stateErrorMessage:
        '요청 상태를 안전하게 확인할 수 없습니다. 나중에 다시 시도하세요.',
    },

    zh: {
      checkingRequest:
        '正在检查请求...',
      requestUnavailableTitle:
        '无法检查请求',
      requestUnavailableMessage:
        '请检查网络连接后重试。',
      pointOfNoReturnTitle:
        '已无法取消',
      pointOfNoReturnMessage:
        '不可逆的删除操作已经开始。',
      notCancellableTitle:
        '无法取消请求',
      notCancellableMessage:
        '此删除请求目前不符合取消条件。',
      stateErrorTitle:
        '无法验证请求',
      stateErrorMessage:
        '无法安全验证请求状态。请稍后重试。',
    },

    ar: {
      checkingRequest:
        'جارٍ التحقق من الطلب...',
      requestUnavailableTitle:
        'تعذر التحقق من الطلب',
      requestUnavailableMessage:
        'تحقق من الاتصال وحاول مرة أخرى.',
      pointOfNoReturnTitle:
        'لم يعد الإلغاء متاحًا',
      pointOfNoReturnMessage:
        'بدأت بالفعل عملية حذف لا يمكن التراجع عنها.',
      notCancellableTitle:
        'لا يمكن إلغاء الطلب',
      notCancellableMessage:
        'طلب الحذف هذا غير مؤهل للإلغاء حاليًا.',
      stateErrorTitle:
        'تعذر التحقق من الطلب',
      stateErrorMessage:
        'تعذر التحقق من حالة الطلب بأمان. حاول مرة أخرى لاحقًا.',
    },

    ru: {
      checkingRequest:
        'Проверка запроса...',
      requestUnavailableTitle:
        'Не удалось проверить запрос',
      requestUnavailableMessage:
        'Проверьте подключение и повторите попытку.',
      pointOfNoReturnTitle:
        'Отмена больше недоступна',
      pointOfNoReturnMessage:
        'Необратимая операция удаления уже началась.',
      notCancellableTitle:
        'Запрос нельзя отменить',
      notCancellableMessage:
        'Этот запрос на удаление сейчас нельзя отменить.',
      stateErrorTitle:
        'Не удалось проверить запрос',
      stateErrorMessage:
        'Не удалось безопасно проверить состояние запроса. Повторите попытку позже.',
    },

    tr: {
      checkingRequest:
        'İstek kontrol ediliyor...',
      requestUnavailableTitle:
        'İstek kontrol edilemedi',
      requestUnavailableMessage:
        'Bağlantınızı kontrol edip tekrar deneyin.',
      pointOfNoReturnTitle:
        'İptal artık kullanılamıyor',
      pointOfNoReturnMessage:
        'Geri alınamaz bir silme işlemi zaten başladı.',
      notCancellableTitle:
        'İstek iptal edilemiyor',
      notCancellableMessage:
        'Bu silme isteği şu anda iptal edilmeye uygun değil.',
      stateErrorTitle:
        'İstek doğrulanamadı',
      stateErrorMessage:
        'İsteğin durumu güvenli şekilde doğrulanamadı. Daha sonra tekrar deneyin.',
    },

    hi: {
      checkingRequest:
        'अनुरोध की जाँच की जा रही है...',
      requestUnavailableTitle:
        'अनुरोध की जाँच नहीं हो सकी',
      requestUnavailableMessage:
        'अपना कनेक्शन जाँचें और फिर से प्रयास करें।',
      pointOfNoReturnTitle:
        'रद्द करना अब उपलब्ध नहीं है',
      pointOfNoReturnMessage:
        'हटाने की अपरिवर्तनीय प्रक्रिया पहले ही शुरू हो चुकी है।',
      notCancellableTitle:
        'अनुरोध रद्द नहीं किया जा सकता',
      notCancellableMessage:
        'यह हटाने का अनुरोध अभी रद्द करने योग्य नहीं है।',
      stateErrorTitle:
        'अनुरोध सत्यापित नहीं हो सका',
      stateErrorMessage:
        'अनुरोध की स्थिति सुरक्षित रूप से सत्यापित नहीं हो सकी। बाद में फिर प्रयास करें।',
    },

    bn: {
      checkingRequest:
        'অনুরোধ যাচাই করা হচ্ছে...',
      requestUnavailableTitle:
        'অনুরোধ যাচাই করা যায়নি',
      requestUnavailableMessage:
        'সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
      pointOfNoReturnTitle:
        'বাতিল করা আর সম্ভব নয়',
      pointOfNoReturnMessage:
        'অপরিবর্তনীয় মুছে ফেলার প্রক্রিয়া ইতিমধ্যে শুরু হয়েছে।',
      notCancellableTitle:
        'অনুরোধ বাতিল করা যাবে না',
      notCancellableMessage:
        'এই মুছে ফেলার অনুরোধটি বর্তমানে বাতিল করা যাবে না।',
      stateErrorTitle:
        'অনুরোধ যাচাই করা যায়নি',
      stateErrorMessage:
        'অনুরোধের অবস্থা নিরাপদে যাচাই করা যায়নি। পরে আবার চেষ্টা করুন।',
    },

    nl: {
      checkingRequest:
        'Verzoek controleren...',
      requestUnavailableTitle:
        'Het verzoek kon niet worden gecontroleerd',
      requestUnavailableMessage:
        'Controleer je verbinding en probeer het opnieuw.',
      pointOfNoReturnTitle:
        'Annuleren is niet meer mogelijk',
      pointOfNoReturnMessage:
        'Een onomkeerbare verwijderingsbewerking is al gestart.',
      notCancellableTitle:
        'Het verzoek kan niet worden geannuleerd',
      notCancellableMessage:
        'Dit verwijderingsverzoek kan momenteel niet worden geannuleerd.',
      stateErrorTitle:
        'Het verzoek kon niet worden geverifieerd',
      stateErrorMessage:
        'De status van het verzoek kon niet veilig worden geverifieerd. Probeer het later opnieuw.',
    },

    pl: {
      checkingRequest:
        'Sprawdzanie wniosku...',
      requestUnavailableTitle:
        'Nie udało się sprawdzić wniosku',
      requestUnavailableMessage:
        'Sprawdź połączenie i spróbuj ponownie.',
      pointOfNoReturnTitle:
        'Anulowanie nie jest już dostępne',
      pointOfNoReturnMessage:
        'Nieodwracalna operacja usuwania już się rozpoczęła.',
      notCancellableTitle:
        'Wniosku nie można anulować',
      notCancellableMessage:
        'Tego wniosku o usunięcie nie można obecnie anulować.',
      stateErrorTitle:
        'Nie udało się zweryfikować wniosku',
      stateErrorMessage:
        'Nie udało się bezpiecznie zweryfikować stanu wniosku. Spróbuj ponownie później.',
    },
  } satisfies Record<
    AppLanguage,
    AccountDeletionCancellationNavigationText
  >;
